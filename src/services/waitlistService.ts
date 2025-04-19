import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import crypto from 'crypto';
import EncryptionConfigManager from './EncryptionConfigManager';
import { fetchIpAndSetFingerprint, generateFingerprint } from '@/Utils';

// Get the authentication token from cookies
const getToken = () => Cookies.get('qbc-auth');

// Use a fallback value for the API base URL if not defined
const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.quickbid.co.in';

const decryptAES = (encryptedData: string, key: Buffer, iv: string) => {
  try {
    console.log("Decryption Started", {
      encryptedDataLength: encryptedData.length,
      keyLength: key.length,
      ivLength: iv.length,
    });

    if (key.length != 32) {
      const error = new Error(`Key must be 32 bytes long`);
      throw error;
    }
    
    const ivBuffer = Buffer.from(iv, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer);
    let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    
    console.log("Decryption Completed", {
      decryptedDataLength: decryptedData.length,
      decryptedDataType: typeof decryptedData
    });
    
    return JSON.parse(decryptedData);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Decryption Failed", {
      errorMessage: err.message,
      errorStack: err.stack,
      encryptedData: encryptedData.substring(0, 50) + '...', // Only log part of the encrypted data
      ivBase64: iv,
    });
    throw error;
  }
};

// Extract waitlist data from the response, handling different data structures
const extractWaitlistData = (data: any): any[] | any => {
  console.log("Extracting waitlist data, received:", typeof data);
  
  // If it's an array, return it directly
  if (Array.isArray(data)) {
    console.log("Data is already an array, returning directly");
    return data;
  }
  
  // If it's an object, check for common data container properties
  if (typeof data === 'object' && data !== null) {
    console.log("Data is an object, checking for data containers");
    
    // Log the keys to help with debugging
    console.log("Available keys:", Object.keys(data));
    
    // Handle the specific structure we're encountering: {success: true, data: {entries: [...]}}
    if (data.success === true && data.data && typeof data.data === 'object') {
      console.log("Found success response with data object");
      
      if (data.data.entries && Array.isArray(data.data.entries)) {
        console.log("Found entries array inside data object");
        return data.data.entries;
      }
      
      // Recursively check the data property
      console.log("Checking inside data property");
      const extractedFromData: any[] | any = extractWaitlistData(data.data);
      if (Array.isArray(extractedFromData) && extractedFromData.length > 0) {
        return extractedFromData;
      }
    }
    
    // Check common patterns for data containers
    if (data.data && Array.isArray(data.data)) {
      console.log("Found data in 'data' property (array)");
      return data.data;
    }
    
    if (data.entries && Array.isArray(data.entries)) {
      console.log("Found data in 'entries' property");
      return data.entries;
    }
    
    if (data.items && Array.isArray(data.items)) {
      console.log("Found data in 'items' property");
      return data.items;
    }
    
    if (data.waitlist && Array.isArray(data.waitlist)) {
      console.log("Found data in 'waitlist' property");
      return data.waitlist;
    }
    
    if (data.users && Array.isArray(data.users)) {
      console.log("Found data in 'users' property");
      return data.users;
    }
    
    if (data.results && Array.isArray(data.results)) {
      console.log("Found data in 'results' property");
      return data.results;
    }
    
    // If there's a single array property that might contain our data
    const arrayProps = Object.entries(data).filter(([_, value]) => Array.isArray(value));
    if (arrayProps.length === 1) {
      console.log(`Found single array property: ${arrayProps[0][0]}`);
      return arrayProps[0][1];
    }
    
    // If we have a response object with status, check the data property
    if (data.status && data.data) {
      console.log("Found response object with status and data");
      return extractWaitlistData(data.data); // Recursive call to handle the data property
    }
    
    // Last resort - check if the object itself has expected waitlist user properties
    if (data._id || (data.name && data.email)) {
      console.log("Object appears to be a single waitlist user, wrapping in array");
      return [data];
    }
  }
  
  console.log("Could not determine data structure, returning original data");
  return data;
};

/**
 * Fetches waitlist users from the API
 * @returns {Promise<Array>} List of waitlist users
 */
export const fetchWaitlistUsers = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    // Generate fingerprints
    const geoTag = await fetchIpAndSetFingerprint();
    const fingerprint = await generateFingerprint();
    
    const apiBaseUrl = getApiBaseUrl();
    console.log(`Using API base URL: ${apiBaseUrl}`);
    
    const response = await axios.get(
      `${apiBaseUrl}/qb/users/v1/waitlist`,
      {
        headers: {
          Authorization: `${token}`,
          "x-api-key": "quickbid@2024",
          "X-TS-Token": fingerprint,
          "X-GEO-TAG": geoTag,
        },
      }
    );
    
    console.log("API Response:", JSON.stringify(response.data).substring(0, 100) + '...');
    
    // Check for encryption in response.data (case 1: encryption params in the data object)
    if (
      response.data &&
      typeof response.data === "object" &&
      response.data.data &&
      response.data["X-Encryption-Enabled"] === "true" &&
      response.data["X-Encryption-IV"]
    ) {
      console.log("Encryption detected in response.data object");
      // Decrypt the data
      const encryptionManager = new EncryptionConfigManager();
      const key = encryptionManager.getKey();
      
      const decryptedData = decryptAES(
        response.data.data,
        key,
        response.data["X-Encryption-IV"]
      );
      
      console.log("Decrypted data:", typeof decryptedData, Array.isArray(decryptedData) ? decryptedData.length : 'not array');
      console.log("Decrypted data sample:", JSON.stringify(decryptedData).substring(0, 100) + '...');
      
      return extractWaitlistData(decryptedData);
    }
    
    // Check for encryption in headers (case 2: encryption params in headers)
    if (
      response.data &&
      typeof response.data === "object" &&
      response.data.data &&
      response.headers["x-encryption-enabled"] === "true" &&
      response.headers["x-encryption-iv"]
    ) {
      console.log("Encryption detected in response headers");
      // Decrypt the data
      const encryptionManager = new EncryptionConfigManager();
      const key = encryptionManager.getKey();
      
      const decryptedData = decryptAES(
        response.data.data,
        key,
        response.headers["x-encryption-iv"]
      );
      
      console.log("Decrypted data:", typeof decryptedData, Array.isArray(decryptedData) ? decryptedData.length : 'not array');
      return extractWaitlistData(decryptedData);
    }
    
    // If the data field itself is a string, it might be directly encrypted
    if (
      response.data &&
      typeof response.data === "string" &&
      response.headers["x-encryption-enabled"] === "true" &&
      response.headers["x-encryption-iv"]
    ) {
      console.log("Direct string encryption detected");
      const encryptionManager = new EncryptionConfigManager();
      const key = encryptionManager.getKey();
      
      const decryptedData = decryptAES(
        response.data,
        key,
        response.headers["x-encryption-iv"]
      );
      
      console.log("Decrypted data:", typeof decryptedData, Array.isArray(decryptedData) ? decryptedData.length : 'not array');
      return extractWaitlistData(decryptedData);
    }
    
    // If response.data itself is the encrypted data format
    if (
      response.data &&
      typeof response.data === "object" && 
      response.data.data && 
      typeof response.data.data === "string"
    ) {
      console.log("Plain data in response.data.data field");
      return extractWaitlistData(response.data.data);
    }
    
    // If not encrypted, return the data directly
    console.log("No encryption detected, returning data directly");
    return extractWaitlistData(response.data);
  } catch (error: unknown) {
    console.error('Error fetching waitlist users:', error);
    
    const axiosError = error as AxiosError;
    
    // Handle error response decryption if needed
    if (
      axiosError.response &&
      axiosError.response.data &&
      typeof axiosError.response.data === "object" &&
      (axiosError.response.data as any).data &&
      ((axiosError.response.data as any)["X-Encryption-Enabled"] === "true" || 
       axiosError.response.headers["x-encryption-enabled"] === "true")
    ) {
      try {
        const encryptionManager = new EncryptionConfigManager();
        const key = encryptionManager.getKey();
        
        // Get the IV from the response data or headers
        const iv = (axiosError.response.data as any)["X-Encryption-IV"] || 
                  axiosError.response.headers["x-encryption-iv"] as string;
                  
        if (!iv) {
          console.error("No encryption IV found in error response");
          throw new Error("No encryption IV found in error response");
        }
        
        const decryptedError = decryptAES(
          (axiosError.response.data as any).data,
          key,
          iv
        );
        
        console.error('Decrypted error:', decryptedError);
      } catch (decryptionError) {
        console.error('Error decrypting error response:', decryptionError);
      }
    }
    
    // Handle authentication errors
    if (axiosError.response && axiosError.response.status === 401) {
      Cookies.remove('qbc-auth');
      Cookies.remove('qbci');
      if (typeof window !== 'undefined') {
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_SIGNUP_URL}`;
      }
    }
    
    throw error;
  }
}; 