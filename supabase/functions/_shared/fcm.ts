// Firebase Cloud Messaging (FCM) High-Priority Notification Dispatcher Helper

export interface FCMPayload {
  targetToken: string;
  title: string;
  body: string;
  dataPayload?: Record<string, string>;
}

export async function sendFCMNotification(payload: FCMPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");

  if (!fcmServerKey) {
    console.warn("FCM_SERVER_KEY is not configured. FCM push notification skipped.");
    return { success: false, error: "FCM_SERVER_KEY missing" };
  }

  try {
    const fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${fcmServerKey}`,
      },
      body: JSON.stringify({
        to: payload.targetToken,
        priority: "high",
        notification: {
          title: payload.title,
          body: payload.body,
          sound: "emergency_alert.mp3",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        data: payload.dataPayload || {},
        android: {
          priority: "high",
          notification: {
            sound: "emergency_alert.mp3",
            channel_id: "emergency_alerts_channel",
          },
        },
      }),
    });

    const result = await fcmResponse.json();
    return {
      success: result.success === 1,
      messageId: result.results?.[0]?.message_id,
      error: result.results?.[0]?.error,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
