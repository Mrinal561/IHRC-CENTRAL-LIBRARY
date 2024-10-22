export interface AuthUser {
    uuid: string;
    name: string;
    email: string;
    role: {
      name: string;
      is_admin: number;
      permissions: {
        subject: string;
        action: string;
      }[];
    };
    platforms: {
      uuid: string;
      name: string;
      abbr: string;
      color: string;
      logo: string;
      google_feed?: string;
      fb_feed?: string;
    }[];
  }
  