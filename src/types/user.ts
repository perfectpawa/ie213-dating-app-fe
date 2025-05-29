export interface User {
  _id: string;           // Backend user ID
  email: string;
  auth_id?: string;      // Auth provider ID
  completeProfile: boolean;  // Flag to track if user has completed profile setup
  isVerified: boolean;  // Flag to track if user has verified their email
  user_name?: string;    // User's display name
  full_name?: string;   // User's full name
  gender?: string;      // User's gender
  bio?: string;        // User's biography
  profile_picture?: string; // URL to user's profile picture
  age?: number;        // User's age
  location?: string;    // User's location
  interests?: string[]; // User's interests
  photos?: string[];    // Additional photos
  occupation?: string;  // User's job/occupation
  education?: string;   // User's education level or institution
  preferences?: {      // User's preferences for matching
    minAge?: number;
    maxAge?: number;
    distance?: number;
    genderPreference?: string[];
  };
  lastActive?: Date;    // When the user was last active
  createdAt?: Date;     // When the user created their account
  updatedAt?: Date;     // When the user last updated their profile
}

export interface UpdateUserDto {
  id?: string;
  username?: string;
  full_name?: string;
  gender?: string;
  bio?: string;
  profile_picture?: string;
  completeProfile?: boolean;
  age?: number;
  location?: string;
  interests?: string[];
  photos?: string[];
  occupation?: string;
  education?: string;
  preferences?: {
    minAge?: number;
    maxAge?: number;
    distance?: number;
    genderPreference?: string[];
  };
}