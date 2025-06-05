import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { metaApiService } from './metaApi';

class WhatsAppService {
  /**
   * Register webhook with Meta/WhatsApp
   * This can be called from an admin panel or settings page
   */
  async setupWebhook(webhookUrl: string, verifyToken: string) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${API_CONFIG.meta.whatsappBusinessId}/subscribed_apps`,
        {
          access_token: API_CONFIG.meta.accessToken,
        }
      );
      
      console.log('Webhook subscription response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error setting up webhook:', error);
      throw error;
    }
  }

  /**
   * Test the webhook connection by sending a test message to yourself
   */
  async testWebhookConnection(phoneNumber: string) {
    try {
      // First verify webhook subscription
      const verifyResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${API_CONFIG.meta.whatsappBusinessId}/subscribed_apps`,
        {
          params: {
            access_token: API_CONFIG.meta.accessToken,
          }
        }
      );
      
      console.log('Current webhook subscriptions:', verifyResponse.data);
      
      // Then send a test message
      const messageResponse = await metaApiService.sendWhatsAppTextMessage(
        phoneNumber,
        "This is a test message to verify webhook setup. Please reply to test the webhook reception."
      );
      
      return {
        subscriptions: verifyResponse.data,
        messageSent: messageResponse
      };
    } catch (error) {
      console.error('Error testing webhook connection:', error);
      throw error;
    }
  }

  /**
   * Retrieve webhook configuration from Meta
   */
  async getWebhookStatus() {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${API_CONFIG.meta.whatsappBusinessId}/subscribed_apps`,
        {
          params: {
            access_token: API_CONFIG.meta.accessToken,
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting webhook status:', error);
      throw error;
    }
  }
}

export const whatsAppService = new WhatsAppService(); 