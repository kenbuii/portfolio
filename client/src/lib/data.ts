// Import generated images
import cover1 from "@assets/generated_images/mid-century_modern_book_cover_design_abstract_geometric_shapes.png";
import cover2 from "@assets/generated_images/mid-century_modern_book_cover_design_abstract_organic_forms.png";
import cover3 from "@assets/generated_images/mid-century_modern_book_cover_design_typography_focus.png";
import cover4 from "@assets/generated_images/mid-century_modern_book_cover_design_abstract_lines.png";

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
