// Import generated images
import cover1 from "@assets/generated_images/mid-century_modern_book_cover_design_abstract_geometric_shapes.png";
import cover2 from "@assets/generated_images/mid-century_modern_book_cover_design_abstract_organic_forms.png";
import cover3 from "@assets/generated_images/mid-century_modern_book_cover_design_typography_focus.png";
import cover4 from "@assets/generated_images/mid-century_modern_book_cover_design_abstract_lines.png";

// Profile type for homepage hero section
export interface Profile {
  name: string;
  bio: string; // HTML content from rich text editor
}

export const defaultProfile: Profile = {
  name: "Ken Bui",
  bio: `<p>I am fascinated by systems.</p><p>Things I find interesting include, but are not limited to: cybernetics, political economy, science and technology studies, human-computer interaction, interface design, Soviet and Russian history, poetry, literature of all stripes, abstract expressionism, Catholic theology (especially liberation theology), Leninism, Kazimir Malevich, food history, and French cuisine.</p>`
};

// About section type
export interface About {
  content: string; // HTML content
  profileImage: string;
  gallery: string[]; // Array of image URLs
}

export const defaultAbout: About = {
  content: `<p>Welcome to my corner of the internet. I'm a curious mind drawn to the intersections of technology, culture, and design.</p><p>This space serves as both a personal archive and a public notebook—a place to collect thoughts, share discoveries, and document the ongoing project of making sense of the world.</p>`,
  profileImage: "/State_Quality_Mark_Of_The_USSR_(Black).png",
  gallery: []
};

// LocalStorage keys
export const STORAGE_KEYS = {
  PROFILE: "portfolio_profile",
  BOOKS: "bookshelf_books",
  WRITINGS: "portfolio_writings",
  ABOUT: "portfolio_about",
} as const;

// Helper to get about from localStorage or default
export function getStoredAbout(): About {
  if (typeof window === "undefined") return defaultAbout;
  const stored = localStorage.getItem(STORAGE_KEYS.ABOUT);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultAbout;
    }
  }
  return defaultAbout;
}

// Helper to compress base64 images
export function compressImage(base64: string, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    // If not a base64 image, return as-is
    if (!base64.startsWith("data:image")) {
      resolve(base64);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale down if larger than maxWidth
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to JPEG for better compression
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

// Helper to save about to localStorage with image compression
export async function saveAbout(about: About): Promise<void> {
  try {
    // Compress profile image if it's base64
    const compressedProfileImage = await compressImage(about.profileImage);
    
    // Compress gallery images
    const compressedGallery = await Promise.all(
      about.gallery.map(img => compressImage(img))
    );

    const compressedAbout = {
      ...about,
      profileImage: compressedProfileImage,
      gallery: compressedGallery,
    };

    const data = JSON.stringify(compressedAbout);
    
    // Check size before saving (localStorage limit is ~5MB)
    if (data.length > 4 * 1024 * 1024) {
      throw new Error("Data too large. Try using smaller images or fewer gallery items.");
    }

    localStorage.setItem(STORAGE_KEYS.ABOUT, data);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Data too large")) {
      throw error;
    }
    throw new Error("Failed to save. Storage quota exceeded. Try removing some images.");
  }
}

// Helper to get profile from localStorage or default
export function getStoredProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProfile;
    }
  }
  return defaultProfile;
}

// Helper to save profile to localStorage
export function saveProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  description: string;
  cover: string;
  rating: number;
  review: string;
  link: string;
  color: string;
}

export const books: Book[] = [
  {
    id: "1",
    title: "The Architecture of Thought",
    author: "Elena V. Rostova",
    synopsis: "An exploration of how physical spaces shape our mental landscapes.",
    description: "In this groundbreaking work, Rostova argues that the buildings we inhabit are not merely shelters, but active participants in our cognitive processes. Drawing from neuroscience, architectural history, and philosophy, she constructs a compelling case for 'cognitive architecture'.",
    cover: cover1,
    rating: 5,
    review: "A masterpiece of interdisciplinary thinking. Changed how I see my own home.",
    link: "#",
    color: "#123524"
  },
  {
    id: "2",
    title: "Silent Echoes",
    author: "Marcus Thorne",
    synopsis: "A collection of essays on the disappearing art of silence in the digital age.",
    description: "Thorne's prose is as sparse and elegant as the subject he treats. 'Silent Echoes' is a plea for quietude in a world that demands constant noise. It is not a rejection of technology, but a manual for living alongside it without losing oneself.",
    cover: cover2,
    rating: 4.5,
    review: "Poetic, haunting, and incredibly necessary for our times.",
    link: "#",
    color: "#A0522D"
  },
  {
    id: "3",
    title: "Digital Zen",
    author: "Sarah Chen",
    synopsis: "Minimalism principles applied to software engineering and interface design.",
    description: "Chen translates ancient Zen philosophy into practical guidelines for modern digital creators. From code structure to UI whitespace, she demonstrates that less is not just more—it is everything.",
    cover: cover3,
    rating: 4.8,
    review: "The bible for any designer who values clarity over clutter.",
    link: "#",
    color: "#007BA7"
  },
  {
    id: "4",
    title: "Future Past",
    author: "J.D. Salinger (Fictional)",
    synopsis: "A retrospective on mid-century futurism and what we got wrong.",
    description: "Looking back at the optimistic projections of the 1950s and 60s, this book analyzes why the flying cars never arrived, but the pocket computers did. A fascinating cultural history of expectation vs. reality.",
    cover: cover4,
    rating: 4.2,
    review: "Witty, insightful, and visually stunning with its archival photos.",
    link: "#",
    color: "#D2691E"
  }
];
