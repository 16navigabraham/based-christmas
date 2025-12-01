// Farcaster SDK types
declare global {
  interface Window {
    sdk?: {
      actions: {
        composeCast: (params: {
          text: string;
          embeds: string[];
        }) => Promise<{
          cast?: {
            hash: string;
          };
        }>;
      };
    };
  }
}

export {};
