interface InviteEmailData {
  inviteeName: string;
  inviteeEmail: string;
  eventTitle: string;
  eventDescription?: string;
  hostEmail: string;
  inviteUrl: string;
  timeOptions: Array<{
    startTime: Date;
    endTime: Date;
  }>;
}

interface FinalizationEmailData {
  inviteeName: string;
  inviteeEmail: string;
  eventTitle: string;
  selectedTime: {
    startTime: Date;
    endTime: Date;
  };
  location?: string;
  additionalInfo?: string;
}

/**
 * Generate HTML email template for invite
 */
function generateInviteEmailHTML(data: InviteEmailData): string {
  const timeOptionsHTML = data.timeOptions
    .map((option) => {
      const dateStr = option.startTime.toLocaleDateString('nl-NL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      const startTimeStr = option.startTime.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const endTimeStr = option.endTime.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `<li style="margin: 8px 0;">${dateStr}, ${startTimeStr} - ${endTimeStr}</li>`;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Uitnodiging voor ${data.eventTitle}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #8B2635 0%, #C17A6F 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🍷 Wijnproeverij Uitnodiging</h1>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hallo ${data.inviteeName},</p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Je bent uitgenodigd voor <strong>${data.eventTitle}</strong>!
        </p>

        ${
          data.eventDescription
            ? `<p style="font-size: 14px; color: #666; margin-bottom: 20px; padding: 15px; background: white; border-left: 4px solid #8B2635; border-radius: 4px;">${data.eventDescription}</p>`
            : ''
        }

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="font-size: 18px; color: #8B2635; margin-top: 0;">Mogelijke tijdstippen:</h2>
          <ul style="list-style: none; padding: 0;">
            ${timeOptionsHTML}
          </ul>
        </div>

        <p style="font-size: 16px; margin: 30px 0;">
          Klik op de knop hieronder om je beschikbaarheid door te geven en eventueel een wijn toe te voegen:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.inviteUrl}" style="display: inline-block; background: #8B2635; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Reageer op uitnodiging
          </a>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Of kopieer deze link naar je browser: <br>
          <a href="${data.inviteUrl}" style="color: #8B2635; word-break: break-all;">${data.inviteUrl}</a>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 12px; color: #999; text-align: center;">
          Deze uitnodiging is verzonden via Wijnproeverij Planner<br>
          Vragen? Neem contact op met ${data.hostEmail}
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version of invite email
 */
function generateInviteEmailText(data: InviteEmailData): string {
  const timeOptionsText = data.timeOptions
    .map((option) => {
      const dateStr = option.startTime.toLocaleDateString('nl-NL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      const startTimeStr = option.startTime.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const endTimeStr = option.endTime.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `  • ${dateStr}, ${startTimeStr} - ${endTimeStr}`;
    })
    .join('\n');

  return `
Hallo ${data.inviteeName},

Je bent uitgenodigd voor ${data.eventTitle}!

${data.eventDescription ? `${data.eventDescription}\n\n` : ''}
Mogelijke tijdstippen:
${timeOptionsText}

Klik op deze link om je beschikbaarheid door te geven en eventueel een wijn toe te voegen:
${data.inviteUrl}

---
Deze uitnodiging is verzonden via Wijnproeverij Planner
Vragen? Neem contact op met ${data.hostEmail}
  `.trim();
}

/**
 * Generate HTML email template for finalization
 */
function generateFinalizationEmailHTML(data: FinalizationEmailData): string {
  const dateStr = data.selectedTime.startTime.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const startTimeStr = data.selectedTime.startTime.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTimeStr = data.selectedTime.endTime.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.eventTitle} - Bevestiging</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D5016 0%, #7FA84F 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Wijnproeverij Bevestiging</h1>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hallo ${data.inviteeName},</p>

        <p style="font-size: 16px; margin-bottom: 20px;">
          <strong>${data.eventTitle}</strong> staat definitief gepland!
        </p>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2D5016;">
          <h2 style="font-size: 18px; color: #2D5016; margin-top: 0;">📅 Wanneer:</h2>
          <p style="font-size: 16px; margin: 10px 0;">
            <strong>${dateStr}</strong><br>
            ${startTimeStr} - ${endTimeStr}
          </p>

          ${
            data.location
              ? `
            <h2 style="font-size: 18px; color: #2D5016; margin-top: 20px;">📍 Locatie:</h2>
            <p style="font-size: 16px; margin: 10px 0;">${data.location}</p>
          `
              : ''
          }
        </div>

        ${
          data.additionalInfo
            ? `
          <div style="background: #fff9e6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; color: #666; margin: 0;">${data.additionalInfo}</p>
          </div>
        `
            : ''
        }

        <p style="font-size: 16px; margin: 30px 0;">
          We kijken ernaar uit om je te zien! 🍷
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

        <p style="font-size: 12px; color: #999; text-align: center;">
          Deze bevestiging is verzonden via Wijnproeverij Planner
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version of finalization email
 */
function generateFinalizationEmailText(data: FinalizationEmailData): string {
  const dateStr = data.selectedTime.startTime.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const startTimeStr = data.selectedTime.startTime.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTimeStr = data.selectedTime.endTime.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
Hallo ${data.inviteeName},

${data.eventTitle} staat definitief gepland!

Wanneer: ${dateStr}
Tijd: ${startTimeStr} - ${endTimeStr}
${data.location ? `Locatie: ${data.location}\n` : ''}
${data.additionalInfo ? `\n${data.additionalInfo}\n` : ''}
We kijken ernaar uit om je te zien! 🍷

---
Deze bevestiging is verzonden via Wijnproeverij Planner
  `.trim();
}

/**
 * Send invite email using configured email provider
 * This is a placeholder that needs to be implemented with actual email service
 */
export async function sendInviteEmail(data: InviteEmailData): Promise<boolean> {
  try {
    // TODO: Implement with actual email service (SendGrid, Postmark, etc.)
    // Generate email content (will be used when email service is implemented)
    void generateInviteEmailHTML(data);
    void generateInviteEmailText(data);

    console.log('[Email] Would send invite to:', data.inviteeEmail);
    console.log('[Email] Subject:', `Uitnodiging: ${data.eventTitle}`);
    console.log('[Email] From:', process.env.EMAIL_FROM || 'noreply@winetasting.app');

    // Placeholder for actual implementation:
    // const htmlContent = generateInviteEmailHTML(data);
    // const textContent = generateInviteEmailText(data);
    // const result = await emailProvider.send({
    //   to: data.inviteeEmail,
    //   from: process.env.EMAIL_FROM,
    //   subject: `Uitnodiging: ${data.eventTitle}`,
    //   html: htmlContent,
    //   text: textContent,
    // });

    return true;
  } catch (error) {
    console.error('[Email] Failed to send invite:', error);
    return false;
  }
}

/**
 * Send finalization/confirmation email
 */
export async function sendFinalizationEmail(data: FinalizationEmailData): Promise<boolean> {
  try {
    // TODO: Implement with actual email service
    // Generate email content (will be used when email service is implemented)
    void generateFinalizationEmailHTML(data);
    void generateFinalizationEmailText(data);

    console.log('[Email] Would send confirmation to:', data.inviteeEmail);
    console.log('[Email] Subject:', `Bevestiging: ${data.eventTitle}`);

    return true;
  } catch (error) {
    console.error('[Email] Failed to send confirmation:', error);
    return false;
  }
}

/**
 * Send bulk invites to all invitees
 */
export async function sendBulkInvites(
  invites: InviteEmailData[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const invite of invites) {
    const success = await sendInviteEmail(invite);
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}