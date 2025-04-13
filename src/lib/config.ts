// Environment configuration
export const config = {
  // Stripe keys
  STRIPE_PUBLIC_KEY: 'pk_live_51QiT6BBdgZl0J6m4fTP3HgQfRHtcHbX5oOqUDcbQJTgHd3jXWOkDJRUcHIhSiZZMn17pFsYCWCUMQHVRgkfv22AN00k9Uuq7bc',
  STRIPE_SECRET_KEY: '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',
  
  // ZegoCloud keys
  ZEGO: {
    // Live streaming
    LIVE: {
      APP_ID: 1287837653,
      SERVER_SECRET: 'c725451fd1a871e2223c71994190964c',
      CONFIG: {
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        scenario: {
          mode: "LiveStreaming",
          config: {
            role: "Host",
          },
        },
      }
    },
    
    // Video readings
    VIDEO: {
      APP_ID: 1714322900,
      SERVER_SECRET: 'c944e6fd6e126ed399759eb1cf4f0638',
      CONFIG: {
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
        scenario: {
          mode: "OneONoneCall",
          config: {
            role: "Host",
          },
        },
      }
    },
    
    // Phone readings
    PHONE: {
      APP_ID: 2121316001,
      SERVER_SECRET: '47ce0b8e2a1aa93915fd494e3083ff9c',
      CONFIG: {
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: false,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: false,
        showScreenSharingButton: false,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
        scenario: {
          mode: "VideoConference",
          config: {
            role: "Host",
          },
        },
      }
    },
    
    // Chat readings
    CHAT: {
      APP_ID: 390659863,
      SERVER_SECRET: 'ffcbc25996c228ee7c057cfbdb364ed0',
      CALLBACK_SECRET: '21b05a5f11e39ab2afb6e00d55e51a5d'
    }
  }
};