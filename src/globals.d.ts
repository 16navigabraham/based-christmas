// Farcaster SDK types
declare global {
  interface Window {
    sdk?: {
      actions: {
        composeCast: (params: {
          text: string;
          embeds: string[];
        }) => void;
      };
    };
  }
}

export {};
