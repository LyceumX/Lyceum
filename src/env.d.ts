declare namespace NodeJS {
  interface ProcessEnv {
    DEEPSEEK_API_KEY?: string;
    OPENAI_API_KEY?: string;
    GOOGLE_GENERATIVE_AI_API_KEY?: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_LIVE?: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_TEST?: string;
    CLERK_SECRET_KEY?: string;
    CLERK_SECRET_KEY_LIVE?: string;
    CLERK_SECRET_KEY_TEST?: string;
    CLERK_FRONTEND_API_URL?: string;
    NEXT_PUBLIC_CLERK_PROXY_URL?: string;
  }
}
