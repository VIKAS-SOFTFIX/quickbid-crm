// Email template interface
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

// Email templates
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to QuickBid!',
    content: `<h2 style="color: #002147">Welcome to QuickBid!</h2>
      <p>Dear [Customer Name],</p>
      <p>We're thrilled to welcome you to QuickBid. Thank you for choosing us for your business needs.</p>
      <p>Here are a few resources to help you get started:</p>
      <ul>
        <li>Access your <a href="https://quickbid.co.in/dashboard" style="color: #002147; text-decoration: underline;">dashboard</a></li>
        <li>Explore our <a href="https://quickbid.co.in/features" style="color: #002147; text-decoration: underline;">features</a></li>
        <li>Read our <a href="https://quickbid.co.in/guides" style="color: #002147; text-decoration: underline;">getting started guide</a></li>
      </ul>
      <p>If you have any questions, please don't hesitate to reach out to our support team at <a href="mailto:support@quickbid.co.in" style="color: #002147; text-decoration: underline;">support@quickbid.co.in</a>.</p>
      <p>Best regards,<br>The QuickBid Team</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #888;">© 2024 QuickBid. All rights reserved.</p>
      </div>`
  },
  {
    id: 'newsletter',
    name: 'Monthly Newsletter',
    subject: 'QuickBid Monthly Update - [Month Year]',
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333;">
      <!-- Header with logo -->
      <div style="background-color: #002147; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <div style="background-color: white; display: inline-block; padding: 15px; border-radius: 8px;">
          <img src="https://quickbid.co.in/Assets/Images/logo.png" alt="QuickBid Logo" style="max-width: 180px; height: auto;">
        </div>
      </div>
      
      <!-- Main header -->
      <div style="background-color: #002147; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Monthly Update - [Month Year]</h1>
        <div style="width: 100px; height: 4px; background-color: #feac0d; margin: 20px auto;"></div>
      </div>
      
      <!-- Main content -->
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hello [Customer Name],</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Here's what's new at QuickBid this month:</p>
        
        <h3 style="color: #002147; font-size: 20px;">Latest Features</h3>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">We've added several new features to enhance your experience:</p>
        <ul style="font-size: 16px; line-height: 1.6; padding-left: 20px; margin-bottom: 30px;">
          <li style="margin-bottom: 10px;"><strong style="color: #002147;">Feature 1</strong> - Description of new feature</li>
          <li style="margin-bottom: 10px;"><strong style="color: #002147;">Feature 2</strong> - Description of new feature</li>
        </ul>
        
        <h3 style="color: #002147; font-size: 20px;">Upcoming Events</h3>
        <div style="background-color: #f7f9fc; border-left: 4px solid #002147; padding: 20px; margin: 30px 0;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0;">Join us for our upcoming webinar on [Date] at [Time].</p>
          <p style="margin-top: 15px; margin-bottom: 0;">
            <a href="https://quickbid.co.in/webinars" style="background-color: #feac0d; color: #002147; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">Register Now</a>
          </p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Stay updated by following us on <a href="#" style="color: #002147; text-decoration: underline;">Twitter</a> and <a href="#" style="color: #002147; text-decoration: underline;">LinkedIn</a>.</p>
      </div>
      
      <!-- Contact section -->
      <div style="padding: 30px; background-color: white; text-align: center; border-bottom: 4px solid #feac0d;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Have questions? Reply directly to this email or contact our support team:</p>
        <p style="margin-bottom: 30px;">
          <a href="mailto:support@quickbid.co.in" style="color: #002147; font-weight: bold; text-decoration: none; border-bottom: 2px solid #feac0d; padding-bottom: 2px;">support@quickbid.co.in</a>
        </p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Best regards,<br>The QuickBid Team
        </p>
      </div>
      
      <!-- Footer -->
      <div style="padding: 20px; background-color: #002147; color: #ffffff; text-align: center; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p>© 2024 QuickBid. All rights reserved.</p>
        <p style="margin-bottom: 0;">
          If you prefer not to receive emails like this, you can <a href="#" style="color: #feac0d; text-decoration: none;">unsubscribe</a>.
        </p>
      </div>
    </div>`
  },
  {
    id: 'pre-launch',
    name: 'Pre-Launch Early Access',
    subject: 'QuickBid Pre-Launch Early Access Bonanza!',
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333;">
      <!-- Header with logo -->
      <div style="background-color: #002147; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <div style="background-color: white; display: inline-block; padding: 15px; border-radius: 8px;">
          <img src="https://quickbid.co.in/Assets/Images/logo.png" alt="QuickBid Logo" style="max-width: 180px; height: auto;">
        </div>
      </div>
      
      <!-- Main header -->
      <div style="background-color: #002147; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Pre-Launch Early Access Bonanza!</h1>
        <div style="width: 100px; height: 4px; background-color: #feac0d; margin: 20px auto;"></div>
      </div>
      
      <!-- Main content -->
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear [Customer Name],</p>
        
        <!-- Main offer section -->
        <div style="background-color: #002147; color: white; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
          <h2 style="color: #feac0d; margin-top: 0; font-size: 22px;">Why burn ₹30,000–₹40,000 a year on basic tender notifications & alerts?</h2>
          
          <div style="border: 2px dashed #feac0d; padding: 20px; border-radius: 4px; margin-top: 20px;">
            <h3 style="color: #ffffff; margin-top: 0; font-size: 20px;">Get More. Pay Unbelievable.</h3>
            <p style="font-size: 16px; margin-bottom: 15px;">With QuickBid, you get <strong>Real-time Tender Notifications + AI-powered Insights</strong> — all for just:</p>
            <p style="font-size: 24px; font-weight: bold; color: #ffffff; margin: 15px 0;">Just <span style="color: #feac0d;">₹1,999</span>/year!</p>
            <p style="font-size: 16px; color: #cccccc;"><span style="text-decoration: line-through;">Regular ₹30,000-₹40,000</span></p>
            <div style="width: 80px; height: 2px; background-color: #feac0d; margin: 20px auto;"></div>
            <p style="font-size: 16px; margin-bottom: 20px;">Plus a <strong style="color: #feac0d;">Free Tender Guide Book</strong></p>
            <div style="margin-top: 25px;">
              <a href="https://quickbid.co.in/waitlist" style="background-color: #feac0d; color: #002147; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">JOIN THE WAITLIST</a>
            </div>
          </div>
          
          <p style="font-size: 18px; font-weight: bold; margin-top: 30px;">Smarter. Faster. Economical.</p>
          <p style="font-style: italic;">Don't miss this exclusive pre-launch deal — your smartest tender move starts here.</p>
        </div>
      </div>
      
      <!-- Features grid -->
      <div style="padding: 20px 30px 40px; background-color: #f7f9fc;">
        <h3 style="color: #002147; text-align: center; margin-bottom: 30px; font-size: 20px;">Why Choose QuickBid?</h3>
        
        <table style="width: 100%; border-spacing: 15px; border-collapse: separate;">
          <tr>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">🔔</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">Real-time Tender Alerts</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Get notified instantly about new tender opportunities matching your business profile.</p>
            </td>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">💡</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">AI-powered Insights</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Our AI analyzes tender requirements and suggests the best opportunities for your business.</p>
            </td>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">📊</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">Comprehensive Dashboard</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Track all your tender applications in one place with status updates and deadline reminders.</p>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Contact section -->
      <div style="padding: 30px; background-color: white; text-align: center; border-bottom: 4px solid #feac0d;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Have questions? Reply directly to this email or contact our support team:</p>
        <p style="margin-bottom: 30px;">
          <a href="mailto:support@quickbid.co.in" style="color: #002147; font-weight: bold; text-decoration: none; border-bottom: 2px solid #feac0d; padding-bottom: 2px;">support@quickbid.co.in</a>
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">We can't wait to help you win more tenders!</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Best regards,<br>The QuickBid Team
        </p>
      </div>
      
      <!-- Footer -->
      <div style="padding: 20px; background-color: #002147; color: #ffffff; text-align: center; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p>© 2024 QuickBid. All rights reserved.</p>
        <p style="margin-bottom: 0;">
          If you prefer not to receive emails like this, you can <a href="#" style="color: #feac0d; text-decoration: none;">unsubscribe</a>.
        </p>
      </div>
    </div>`
  },
  {
    id: 'waitlist',
    name: 'Join Waitlist',
    subject: "You're on the QuickBid Waitlist!",
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333;">
      <!-- Header with logo -->
      <div style="background-color: #002147; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <div style="background-color: white; display: inline-block; padding: 15px; border-radius: 8px;">
          <img src="https://quickbid.co.in/Assets/Images/logo.png" alt="QuickBid Logo" style="max-width: 180px; height: auto;">
        </div>
      </div>
      
      <!-- Main header -->
      <div style="background-color: #002147; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">You're on the QuickBid Waitlist!</h1>
        <div style="width: 100px; height: 4px; background-color: #feac0d; margin: 20px auto;"></div>
      </div>
      
      <!-- Main content -->
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear [Customer Name],</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">We're thrilled to have you on board! <strong>You're now officially on the QuickBid waitlist</strong> for our revolutionary tender management platform.</p>
        
        <!-- Waitlist status -->
        <div style="background-color: #f7f9fc; border-left: 4px solid #002147; padding: 20px; margin: 30px 0;">
          <h3 style="color: #002147; margin-top: 0; font-size: 18px;">Your Waitlist Status:</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li style="margin-bottom: 10px;">Dear user, <strong style="color: #002147;">thank you for joining our waitlist!</strong></li>
            <li style="margin-bottom: 10px;">We'll notify you as soon as we launch</li>
            <li style="margin-bottom: 0;">Early waitlist members get exclusive access to our pre-launch offers</li>
          </ul>
        </div>
        
        <!-- Special offer section -->
        <div style="background-color: #002147; color: white; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
          <div style="border: 2px dashed #feac0d; padding: 20px; border-radius: 4px;">
            <h2 style="color: #feac0d; margin-top: 0; font-size: 22px;">🎉 Your Early Access Offer</h2>
            <p style="font-size: 16px; margin-bottom: 15px;">As a waitlist member, you'll get:</p>
            <p style="font-size: 24px; font-weight: bold; color: #ffffff; margin: 10px 0;">Annual Access at just <span style="color: #feac0d;">₹1,999</span></p>
            <p style="font-size: 16px; color: #cccccc; margin-top: 0;"><span style="text-decoration: line-through;">Regular ₹30,000-₹40,000</span></p>
            <div style="width: 80px; height: 2px; background-color: #feac0d; margin: 20px auto;"></div>
            <p style="font-size: 16px; margin-bottom: 20px;">Plus a <strong style="color: #feac0d;">Free Tender Guide Book</strong></p>
            <div style="margin-top: 25px;">
              <a href="https://quickbid.co.in/waitlist" style="background-color: #feac0d; color: #002147; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">JOIN THE WAITLIST</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Features grid -->
      <div style="padding: 20px 30px 40px; background-color: #f7f9fc;">
        <h3 style="color: #002147; text-align: center; margin-bottom: 30px; font-size: 20px;">While you wait, here's a sneak peek of what's coming:</h3>
        
        <table style="width: 100%; border-spacing: 15px; border-collapse: separate;">
          <tr>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">🔔</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">Real-time Tender Alerts</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Get notified instantly about new tender opportunities matching your business profile.</p>
            </td>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">💡</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">AI-powered Insights</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Our AI analyzes tender requirements and suggests the best opportunities for your business.</p>
            </td>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">📊</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">Comprehensive Dashboard</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Track all your tender applications in one place with status updates and deadline reminders.</p>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Contact section -->
      <div style="padding: 30px; background-color: white; text-align: center; border-bottom: 4px solid #feac0d;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Have questions? Reply directly to this email or contact our support team:</p>
        <p style="margin-bottom: 30px;">
          <a href="mailto:support@quickbid.co.in" style="color: #002147; font-weight: bold; text-decoration: none; border-bottom: 2px solid #feac0d; padding-bottom: 2px;">support@quickbid.co.in</a>
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">We can't wait to help you win more tenders!</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Best regards,<br>The QuickBid Team
        </p>
      </div>
      
      <!-- Footer -->
      <div style="padding: 20px; background-color: #002147; color: #ffffff; text-align: center; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p>© 2024 QuickBid. All rights reserved.</p>
        <p style="margin-bottom: 0;">
          If you prefer not to receive emails like this, you can <a href="#" style="color: #feac0d; text-decoration: none;">unsubscribe</a>.
        </p>
      </div>
    </div>`
  },
  {
    id: 'launch-announcement',
    name: 'Launch Announcement - May 18',
    subject: 'QuickBid Launches May 18 - Your Invitation Inside!',
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333;">
      <!-- Header with logo -->
      <div style="background-color: #002147; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <div style="background-color: white; display: inline-block; padding: 15px; border-radius: 8px;">
          <img src="https://quickbid.co.in/Assets/Images/logo.png" alt="QuickBid Logo" style="max-width: 180px; height: auto;">
        </div>
      </div>
      
      <!-- Main header -->
      <div style="background-color: #002147; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">We're Launching May 18, 2025!</h1>
        <div style="width: 100px; height: 4px; background-color: #feac0d; margin: 20px auto;"></div>
      </div>
      
      <!-- Main content -->
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear [Customer Name],</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">The wait is almost over! <strong>QuickBid is officially launching on May 18, 2025</strong>, and we're thrilled to invite you to be among the first to experience our revolutionary tender management platform.</p>
        
        <!-- Countdown section -->
        <div style="background-color: #f7f9fc; border-left: 4px solid #002147; padding: 20px; margin: 30px 0; text-align: center;">
          <h3 style="color: #002147; margin-top: 0; font-size: 18px;">Countdown to Launch Day:</h3>
          
          <div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0;">
            <div style="text-align: center; background-color: #002147; color: white; border-radius: 8px; width: 80px; padding: 15px 0;">
              <div style="font-size: 24px; font-weight: bold; color: #feac0d;">07</div>
              <div style="font-size: 14px;">Days</div>
            </div>
            <div style="text-align: center; background-color: #002147; color: white; border-radius: 8px; width: 80px; padding: 15px 0;">
              <div style="font-size: 24px; font-weight: bold; color: #feac0d;">00</div>
              <div style="font-size: 14px;">Hours</div>
            </div>
            <div style="text-align: center; background-color: #002147; color: white; border-radius: 8px; width: 80px; padding: 15px 0;">
              <div style="font-size: 24px; font-weight: bold; color: #feac0d;">00</div>
              <div style="font-size: 14px;">Minutes</div>
            </div>
          </div>
          
          <p style="font-size: 16px; color: #555; margin-top: 20px;"><strong style="color: #002147;">Just one week away!</strong> Mark your calendar for <strong style="color: #002147;">May 18, 2025</strong></p>
        </div>
        
        <!-- Launch offer section -->
        <div style="background-color: #002147; color: white; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
          <div style="border: 2px dashed #feac0d; padding: 20px; border-radius: 4px;">
            <h2 style="color: #feac0d; margin-top: 0; font-size: 22px;">🚀 Launch Day Special Offer</h2>
            <p style="font-size: 16px; margin-bottom: 15px;">Be one of the first 100 customers to sign up on launch day and get:</p>
            <p style="font-size: 24px; font-weight: bold; color: #ffffff; margin: 10px 0;">Annual Access at just <span style="color: #feac0d;">₹1,999</span></p>
            <p style="font-size: 16px; color: #cccccc; margin-top: 0;"><span style="text-decoration: line-through;">Regular ₹30,000-₹40,000</span></p>
            <div style="width: 80px; height: 2px; background-color: #feac0d; margin: 20px auto;"></div>
            <p style="font-size: 16px; margin-bottom: 20px;"><strong style="color: #feac0d;">PLUS:</strong> Free Tender Guide Book & Premium Support</p>
            <div style="margin-top: 25px;">
              <a href="https://quickbid.co.in/waitlist" style="background-color: #feac0d; color: #002147; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">JOIN THE WAITLIST</a>
            </div>
          </div>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">On <strong>May 18, 2025</strong>, we'll be unveiling the full suite of QuickBid features designed to revolutionize how you discover, apply for, and win government tenders:</p>
        
        <ul style="font-size: 16px; line-height: 1.6; padding-left: 20px; margin-bottom: 30px;">
          <li style="margin-bottom: 10px;"><strong style="color: #002147;">AI-Powered Tender Matching</strong> - Get personalized tender recommendations based on your business profile</li>
          <li style="margin-bottom: 10px;"><strong style="color: #002147;">Real-time Notifications</strong> - Never miss a relevant tender opportunity again</li>
          <li style="margin-bottom: 10px;"><strong style="color: #002147;">Document Management</strong> - Store and organize all your tender documents in one secure place</li>
          <li style="margin-bottom: 0;"><strong style="color: #002147;">Deadline Tracking</strong> - Stay on top of submission deadlines with automated reminders</li>
        </ul>
      </div>
      
      <!-- Features grid -->
      <div style="padding: 20px 30px 40px; background-color: #f7f9fc;">
        <h3 style="color: #002147; text-align: center; margin-bottom: 30px; font-size: 20px;">Get Ready for These Launch Features:</h3>
        
        <table style="width: 100%; border-spacing: 15px; border-collapse: separate;">
          <tr>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">🔔</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">Real-time Tender Alerts</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Get notified instantly about new tender opportunities matching your business profile.</p>
            </td>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">💡</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">AI-powered Insights</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Our AI analyzes tender requirements and suggests the best opportunities for your business.</p>
            </td>
            <td style="background-color: white; padding: 20px; border-radius: 8px; width: 33%; vertical-align: top; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <div style="width: 50px; height: 50px; background-color: #002147; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <span style="color: #feac0d; font-size: 24px; font-weight: bold;">📊</span>
              </div>
              <h4 style="color: #002147; text-align: center; margin-top: 0;">Comprehensive Dashboard</h4>
              <p style="font-size: 14px; line-height: 1.5; text-align: center; color: #555;">Track all your tender applications in one place with status updates and deadline reminders.</p>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Contact section -->
      <div style="padding: 30px; background-color: white; text-align: center; border-bottom: 4px solid #feac0d;">
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Have questions about our launch? Reply directly to this email or contact our support team:</p>
        <p style="margin-bottom: 30px;">
          <a href="mailto:support@quickbid.co.in" style="color: #002147; font-weight: bold; text-decoration: none; border-bottom: 2px solid #feac0d; padding-bottom: 2px;">support@quickbid.co.in</a>
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">We can't wait for you to experience QuickBid on May 18, 2025!</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Best regards,<br>The QuickBid Team
        </p>
      </div>
      
      <!-- Footer -->
      <div style="padding: 20px; background-color: #002147; color: #ffffff; text-align: center; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p>© 2025 QuickBid. All rights reserved.</p>
        <p style="margin-bottom: 0;">
          If you prefer not to receive emails like this, you can <a href="#" style="color: #feac0d; text-decoration: none;">unsubscribe</a>.
        </p>
      </div>
    </div>`
  },
  {
    id: 'Free-trial-announcement',
    name: 'India’s Smartest AI Tender Tool — Try It FREE for 14 Days!',
    subject: 'India’s Smartest AI Tender Tool — Try It FREE for 14 Days!',
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333;">

<!-- Header with logo -->

<div style="background-color: #002147; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">

<div style="background-color: white; display: inline-block; padding: 15px; border-radius: 8px;">

<img src="https://quickbid.co.in/Assets/Images/logo.png" alt="QuickBid Logo" style="max-width: 180px; height: auto;">

</div>

</div>


<!-- Main header -->

<div style="background-color: #002147; padding: 20px; text-align: center;">

<h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Stop Paying for Tender Information</h1>

<div style="width: 100px; height: 4px; background-color: #feac0d; margin: 20px auto;"></div>

</div>


<!-- Main content -->

<div style="padding: 40px 30px; background-color: #ffffff;">

<p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; font-weight: 600;">Dear Sir/Madam,</p>


<p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px; font-weight: 600; color: #002147;">

Stop paying for tender information.<br>

QuickBid gives you 2 powerful tools.

</p>


<div style="width: 60px; height: 2px; background-color: #feac0d; margin: 30px 0;"></div>


<!-- Feature 1 -->

<div style="margin-bottom: 30px;">

<div style="display: flex; align-items: flex-start; margin-bottom: 15px;">

<span style="color: #feac0d; font-size: 20px; font-weight: bold; margin-right: 10px;">✅</span>

<div>

<h3 style="color: #002147; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">100% FREE Tender Information Service</h3>

<p style="font-size: 16px; line-height: 1.6; margin: 0; color: #555;">

Get daily government tender notifications with no hidden fees — forever*.

</p>

</div>

</div>

</div>


<!-- Feature 2 -->

<div style="margin-bottom: 30px;">

<div style="display: flex; align-items: flex-start; margin-bottom: 15px;">

<span style="color: #feac0d; font-size: 20px; font-weight: bold; margin-right: 10px;">🤖</span>

<div>

<h3 style="color: #002147; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">AI-Powered Bid Generator</h3>

<p style="font-size: 16px; line-height: 1.6; margin: 0; color: #555;">

Auto-create tender bid documents in just 30 seconds.<br>

<strong style="color: #002147;">Free trial for 14 days</strong> — no credit card needed.

</p>

</div>

</div>

</div>


<div style="width: 60px; height: 2px; background-color: #feac0d; margin: 30px 0;"></div>


<!-- Key benefit -->

<div style="background-color: #f7f9fc; border-left: 4px solid #002147; padding: 20px; margin: 30px 0; text-align: center;">

<p style="font-size: 16px; line-height: 1.6; margin: 0; color: #002147; font-weight: 600;">

After 14 days, tender alerts stay free.<br>

Upgrade only if you love the AI.

</p>

</div>


<div style="width: 60px; height: 2px; background-color: #feac0d; margin: 30px 0;"></div>


<!-- Call to action -->

<div style="text-align: center; margin: 40px 0;">

<p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px; font-weight: 600; color: #002147;">

🎯 Start Smart. Bid Smarter.

</p>

<p style="margin-bottom: 0;">

<a href="https://quickbid.co.in/signup" style="background-color: #feac0d; color: #002147; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase;">

👉 Create Your Free Account Now

</a>

</p>

</div>

</div>


<!-- Contact section -->

<div style="padding: 30px; background-color: white; text-align: center; border-bottom: 4px solid #feac0d;">

<p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">

Happy Bidding<br>

<strong style="color: #002147;">Team QuickBid</strong><br>

<em style="color: #feac0d; font-weight: 600;">India's Smartest Tender Tech Platform</em>

</p>


<p style="font-size: 14px; color: #666; margin-bottom: 20px;">

Questions? Contact us at <a href="mailto:support@quickbid.co.in" style="color: #002147; font-weight: bold; text-decoration: none; border-bottom: 2px solid #feac0d; padding-bottom: 2px;">support@quickbid.co.in</a>

</p>

</div>


<!-- Footer -->

<div style="padding: 20px; background-color: #002147; color: #ffffff; text-align: center; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">

<p style="margin-bottom: 10px;">© 2024 QuickBid. All rights reserved.</p>

<p style="margin-bottom: 0;">

If you prefer not to receive emails like this, you can <a href="#" style="color: #feac0d; text-decoration: none;">unsubscribe</a>.

</p>

</div>

</div>`
  }
]; 