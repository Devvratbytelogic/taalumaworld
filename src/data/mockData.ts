export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  booksCount: number;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  description: string;
  featuredImage: string;
  price: number;
  isFree: boolean;
  sequence: number;
  content: ContentBlock[];
  pageCount?: number;
}

export interface ContentBlock {
  type: 'text' | 'image';
  content: string; // text content or image URL
  alt?: string; // for images
  caption?: string; // optional caption for images
}

export interface Book {
  id: string;
  title: string;
  description: string;
  authorId: string;
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  coverImage: string;
  pricingType: 'chapter' | 'book';
  bookPrice?: number;
  createdAt: string;
  totalChapters: number;
}

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Fiction',
    subcategories: [
      { id: 'sub-1', name: 'Adventure', categoryId: 'cat-1' },
      { id: 'sub-2', name: 'Mystery', categoryId: 'cat-1' },
      { id: 'sub-3', name: 'Science Fiction', categoryId: 'cat-1' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Non-Fiction',
    subcategories: [
      { id: 'sub-4', name: 'Biography', categoryId: 'cat-2' },
      { id: 'sub-5', name: 'History', categoryId: 'cat-2' },
      { id: 'sub-6', name: 'Science', categoryId: 'cat-2' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Educational',
    subcategories: [
      { id: 'sub-7', name: 'Mathematics', categoryId: 'cat-3' },
      { id: 'sub-8', name: 'Technology', categoryId: 'cat-3' },
      { id: 'sub-9', name: 'Languages', categoryId: 'cat-3' },
    ],
  },
  {
    id: 'cat-4',
    name: 'Self-Help',
    subcategories: [
      { id: 'sub-10', name: 'Personal Growth', categoryId: 'cat-4' },
      { id: 'sub-11', name: 'Career', categoryId: 'cat-4' },
      { id: 'sub-12', name: 'Relationships', categoryId: 'cat-4' },
    ],
  },
];

export const authors: Author[] = [
  {
    id: 'author-1',
    name: 'Sarah Johnson',
    bio: 'Award-winning YA author with a passion for adventure stories',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    booksCount: 5,
  },
  {
    id: 'author-2',
    name: 'Michael Chen',
    bio: 'Science educator and writer making complex topics fun',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    booksCount: 3,
  },
  {
    id: 'author-3',
    name: 'Emily Rodriguez',
    bio: 'Mystery writer who loves crafting puzzles for young readers',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    booksCount: 4,
  },
  {
    id: 'author-4',
    name: 'David Kim',
    bio: 'Tech enthusiast teaching coding to the next generation',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    booksCount: 2,
  },
];

export const books: Book[] = [
  {
    id: 'book-1',
    title: 'The Quantum Quest',
    description: 'A thrilling adventure through space and time where a group of teens discovers they can manipulate quantum realities.',
    authorId: 'author-1',
    categoryId: 'cat-1',
    subcategoryId: 'sub-3',
    tags: ['Space', 'Adventure', 'Science Fiction', 'Time Travel'],
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600',
    pricingType: 'chapter',
    createdAt: '2024-01-15',
    totalChapters: 12,
  },
  {
    id: 'book-2',
    title: 'Code Warriors Academy',
    description: 'Learn programming through an exciting story of students competing in the ultimate coding championship.',
    authorId: 'author-4',
    categoryId: 'cat-3',
    subcategoryId: 'sub-8',
    tags: ['Programming', 'Technology', 'Competition', 'Learning'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    pricingType: 'book',
    bookPrice: 29.99,
    createdAt: '2024-02-01',
    totalChapters: 15,
  },
  {
    id: 'book-3',
    title: 'Mysteries of Moonlight Manor',
    description: 'Five friends must solve the century-old mystery of the abandoned manor before time runs out.',
    authorId: 'author-3',
    categoryId: 'cat-1',
    subcategoryId: 'sub-2',
    tags: ['Mystery', 'Thriller', 'Friendship', 'Puzzle'],
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600',
    pricingType: 'chapter',
    createdAt: '2024-01-20',
    totalChapters: 10,
  },
  {
    id: 'book-4',
    title: 'The Science of Superpowers',
    description: 'Ever wondered if superpowers could be real? Explore the science behind your favorite abilities.',
    authorId: 'author-2',
    categoryId: 'cat-2',
    subcategoryId: 'sub-6',
    tags: ['Science', 'Physics', 'Biology', 'Fun Facts'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
    pricingType: 'book',
    bookPrice: 24.99,
    createdAt: '2024-02-10',
    totalChapters: 8,
  },
  {
    id: 'book-5',
    title: 'Island Survivors',
    description: 'When their school trip goes wrong, six teens must use teamwork and ingenuity to survive on a deserted island.',
    authorId: 'author-1',
    categoryId: 'cat-1',
    subcategoryId: 'sub-1',
    tags: ['Adventure', 'Survival', 'Teamwork', 'Nature'],
    coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
    pricingType: 'chapter',
    createdAt: '2024-01-05',
    totalChapters: 14,
  },
  {
    id: 'book-6',
    title: 'Your First Million Steps',
    description: 'A practical guide for teens to start their entrepreneurial journey and build confidence.',
    authorId: 'author-4',
    categoryId: 'cat-4',
    subcategoryId: 'sub-11',
    tags: ['Career', 'Entrepreneurship', 'Money', 'Success'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    pricingType: 'book',
    bookPrice: 19.99,
    createdAt: '2024-02-15',
    totalChapters: 10,
  },
];

export const chapters: Chapter[] = [
  // Book 1 - The Quantum Quest
  {
    id: 'ch-1-1',
    bookId: 'book-1',
    title: 'The Discovery',
    description: 'Emma finds a mysterious device in her grandmother\'s attic.',
    featuredImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600',
    price: 0,
    isFree: true,
    sequence: 1,
    content: [
      { 
        type: 'text', 
        content: 'The morning sun cast long shadows across the cobblestone streets as Emma made her way through the bustling marketplace. Her grandmother had passed away three months ago, leaving behind a house full of mysteries and memories. Today was the day she\'d finally gathered the courage to explore the attic.\n\nDust particles danced in the light streaming through the small window as Emma climbed the creaky stairs. Boxes upon boxes lined the walls, each one a time capsule from different eras of her grandmother\'s extraordinary life. As a quantum physicist, Gran had always been ahead of her time, working on projects that Emma could barely comprehend.'
      },
      { 
        type: 'image', 
        content: 'https://images.unsplash.com/photo-1737819505312-35f92c84ce3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwcGh5c2ljcyUyMHNwYWNlfGVufDF8fHx8MTc2Nzk1MTAzOHww&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Quantum physics visualization',
        caption: 'The mysterious quantum device glows with an otherworldly light'
      },
      {
        type: 'text',
        content: 'Then she saw it. Nestled in the corner, wrapped in silk cloth, was a device unlike anything she\'d ever seen. It pulsed with a faint blue light, as if it had been waiting for her. Emma\'s hands trembled as she reached for it, her fingers tingling with energy the moment they made contact.\n\nThe device was warm, humming with a frequency that seemed to resonate with her very bones. Inscribed on its surface were equations—Gran\'s handwriting—alongside symbols that looked ancient yet futuristic at the same time. Emma recognized some of the formulas from her advanced physics class, but others were completely foreign.\n\nAs she turned the device over in her hands, a holographic display suddenly sprang to life, projecting complex diagrams into the air around her. Her breath caught in her throat. This wasn\'t just any device—this was something that could change everything she knew about the universe.'
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMHN0dWRlbnRzfGVufDF8fHx8MTc2Nzk1MTAzOXww&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Friends gathering',
        caption: 'Emma shows the device to her closest friends'
      },
      {
        type: 'text',
        content: 'Emma knew she couldn\'t keep this discovery to herself. She immediately texted her three best friends—Marcus, the tech genius; Sara, the fearless adventurer; and Jake, the skeptical scientist. If anyone could help her understand what Gran had created, it would be them.\n\nThey met at their usual spot in the park, where Emma carefully unwrapped the device. The looks on their faces ranged from awe to disbelief. Marcus was already pulling out his tablet, ready to run diagnostics. Sara leaned in closer, her eyes sparkling with excitement. Jake, true to form, crossed his arms and raised an eyebrow.\n\n"Your grandmother built a quantum device? Emma, do you realize what this could mean?" Marcus whispered, his voice barely containing his excitement.\n\nBut Emma did realize. And she knew that their lives were about to change forever.'
      }
    ],
    pageCount: 12,
  },
  {
    id: 'ch-1-2',
    bookId: 'book-1',
    title: 'First Jump',
    description: 'The team makes their first quantum leap.',
    featuredImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600',
    price: 2.99,
    isFree: false,
    sequence: 2,
    content: [
      { 
        type: 'text', 
        content: 'Three days of research had led them to this moment. Marcus had finally deciphered enough of the device\'s code to understand its basic function—it was a quantum displacement generator, capable of shifting matter across parallel dimensions. The team stood in Marcus\'s basement lab, their hearts pounding with a mixture of fear and excitement.\n\n"Are we really doing this?" Sara asked, though her grin suggested she already knew the answer. The device sat on the table before them, now fully activated and glowing brighter than ever.'
      },
      {
        type: 'text',
        content: 'Emma took a deep breath. "Gran wouldn\'t have left this for me if she didn\'t believe I could handle it. We go together, we stay together, and we come back together. Agreed?"\n\nThey all placed their hands on the device. The moment their skin made contact, the world around them began to shimmer and distort. Colors bled into one another like watercolors in rain. The basement walls seemed to breathe, expanding and contracting. Emma\'s stomach lurched as reality itself bent around them.'
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1737819505312-35f92c84ce3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwcGh5c2ljcyUyMHNwYWNlfGVufDF8fHx8MTc2Nzk1MTAzOHww&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Quantum jump visualization',
        caption: 'The moment of quantum displacement—reality itself bends and shifts'
      },
      {
        type: 'text',
        content: 'When the world stopped spinning, they found themselves still in a basement—but not Marcus\'s basement. The walls were the same layout, but everything was different. The posters were for bands that didn\'t exist. The technology looked similar but subtly wrong. And through the small window near the ceiling, they could see a sky with two moons.\n\n"Holy—" Jake\'s voice trailed off as he stared out the window.\n\nThey had done it. They had actually jumped to a parallel universe. Emma felt her grandmother\'s presence in that moment, as if Gran was watching and smiling. The adventure had only just begun, and already nothing would ever be the same.'
      }
    ],
    pageCount: 15,
  },
  {
    id: 'ch-1-3',
    bookId: 'book-1',
    title: 'Parallel Problems',
    description: 'Things get complicated in an alternate reality.',
    featuredImage: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600',
    price: 2.99,
    isFree: false,
    sequence: 3,
    content: [
      { type: 'text', content: 'The parallel world was both familiar and unsettling. As they emerged from the basement onto the street, Emma realized they were in a version of their own town—but one that had taken a drastically different path...' },
    ],
    pageCount: 18,
  },
  // Book 2 - Code Warriors Academy
  {
    id: 'ch-2-1',
    bookId: 'book-2',
    title: 'Welcome to the Academy',
    description: 'Meet the contestants and learn the rules of the competition.',
    featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
    price: 0,
    isFree: true,
    sequence: 1,
    content: [
      {
        type: 'text',
        content: 'The email had arrived three weeks ago, and Alex still couldn\'t believe it was real. Out of thousands of applicants, they had been selected as one of fifty students to attend the prestigious Code Warriors Academy—a month-long intensive program where teens competed to become the next generation of programming prodigies.\n\nThe academy\'s main hall was impressive: floor-to-ceiling windows overlooked a sprawling tech campus, and every surface seemed to be a screen waiting to display code. Alex clutched their laptop bag tighter, taking in the sight of forty-nine other nervous but excited teenagers.'
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGUlMjBsYXB0b3B8ZW58MXx8fHwxNzY3ODcwMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Programming on laptop',
        caption: 'The Code Warriors Academy—where future developers are forged'
      },
      {
        type: 'text',
        content: '"Welcome, warriors!" A voice boomed through the hall. The head instructor, Ms. Chen, stood at the front, her presence commanding immediate attention. "You\'ve been chosen because you showed not just skill, but creativity. Over the next month, you\'ll face challenges that will test every aspect of your programming knowledge—from algorithms to user experience, from debugging to innovation."\n\nShe gestured to the massive display behind her, which lit up with the names of all fifty contestants arranged in a tournament-style bracket. "But this isn\'t just about competition. It\'s about collaboration, learning, and pushing the boundaries of what you think is possible. Some of you will forge friendships that last a lifetime. All of you will leave as better programmers than when you arrived."\n\nAlex felt a tap on their shoulder and turned to see a girl with bright purple hair and a friendly smile. "I\'m Zara. Want to be rivals-slash-study-partners?"\n\nAnd just like that, the adventure began.'
      }
    ],
    pageCount: 10,
  },
  {
    id: 'ch-2-2',
    bookId: 'book-2',
    title: 'Variables and Victory',
    description: 'First challenge: master variables to advance.',
    featuredImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600',
    price: 0,
    isFree: false,
    sequence: 2,
    content: [
      { type: 'text', content: 'The first challenge seemed deceptively simple: create a program that managed a virtual inventory system using variables. But as Alex quickly discovered, the devil was in the details...' },
    ],
    pageCount: 14,
  },
  // Book 3 - Mysteries of Moonlight Manor
  {
    id: 'ch-3-1',
    bookId: 'book-3',
    title: 'The Invitation',
    description: 'A mysterious letter brings five strangers together.',
    featuredImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
    price: 0,
    isFree: true,
    sequence: 1,
    content: [
      {
        type: 'text',
        content: 'The letter had arrived on heavy cream paper, sealed with black wax, and bore no return address. Jordan turned it over in their hands for the third time that morning, still not quite believing what it said:\n\n"You are cordially invited to Moonlight Manor for a weekend that will change your life. Arrive Friday at sunset. Come alone. Tell no one. All will be revealed."\n\nIt was absurd. It was probably a prank. And yet, Jordan found themselves packing a bag on Friday afternoon, curiosity overriding common sense.'
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1613370399668-e55dd4daea2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJpb3VzJTIwb2xkJTIwbWFuc2lvbnxlbnwxfHx8fDE3Njc5NTEwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Mysterious mansion',
        caption: 'Moonlight Manor looms against the darkening sky'
      },
      {
        type: 'text',
        content: 'The manor was exactly as imposing as Jordan had imagined. Three stories of Victorian architecture perched on a hill, its windows dark except for a warm glow from the entrance hall. As Jordan approached, four other teenagers emerged from various paths leading to the manor—each looking as confused and intrigued as Jordan felt.\n\nThey gathered at the massive front doors, eyeing each other warily. A tall girl with curly hair broke the silence first. "I\'m Maya. Please tell me I\'m not the only one who thinks this is completely insane."\n\nRelieved laughter rippled through the group. Introductions were made—Jordan, Maya, Chris, Riley, and Sam. Five strangers brought together by identical mysterious invitations. The question was: why?\n\nAs if in answer, the doors swung open on their own, revealing a grand entrance hall lit by flickering candles. And there, on a table in the center, sat five more envelopes, each with one of their names written in elegant script.\n\nThe mystery had only just begun.'
      }
    ],
    pageCount: 8,
  },
  {
    id: 'ch-3-2',
    bookId: 'book-3',
    title: 'Hidden Passages',
    description: 'The manor reveals its first secret.',
    featuredImage: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=600',
    price: 1.99,
    isFree: false,
    sequence: 2,
    content: [
      { type: 'text', content: 'The envelopes had contained cryptic clues, each one leading to a different room in the manor. As the group split up to investigate, Jordan found themselves drawn to the library—a vast room lined floor to ceiling with ancient books...' },
    ],
    pageCount: 12,
  },
  // Book 4 - The Science of Superpowers
  {
    id: 'ch-4-1',
    bookId: 'book-4',
    title: 'Could We Really Fly?',
    description: 'The physics of flight and what it would take for humans.',
    featuredImage: 'https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=600',
    price: 0,
    isFree: true,
    sequence: 1,
    content: [
      { type: 'text', content: 'Have you ever dreamed of flying? Not in an airplane or a helicopter, but really flying—soaring through the air with nothing but your own power? It\'s one of the most common superpowers in comics and movies, but what would it actually take for a human to fly?\n\nLet\'s break down the science...' },
    ],
    pageCount: 16,
  },
  // Book 5 - Island Survivors
  {
    id: 'ch-5-1',
    bookId: 'book-5',
    title: 'The Storm',
    description: 'Everything goes wrong during what should have been a simple boat trip.',
    featuredImage: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600',
    price: 0,
    isFree: true,
    sequence: 1,
    content: [
      {
        type: 'text',
        content: 'The weather report had been perfect. Clear skies, calm seas, ideal conditions for the school\'s marine biology field trip. That was six hours ago. Now, as lightning split the sky and waves the size of buildings crashed against their boat, Quinn wondered if they would even survive to tell this story.\n\n"Everyone stay low!" Captain Rodriguez shouted over the roar of the storm. "Hold on to—"\n\nThe sentence was cut off as a massive wave struck the boat broadside. Quinn felt the world tilt, heard screaming, and then plunged into cold, dark water.'
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1620930066607-725a158ae1bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGlzbGFuZCUyMGJlYWNofGVufDF8fHx8MTc2Nzg0OTg1NHww&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Tropical island beach',
        caption: 'The island where everything changed'
      },
      {
        type: 'text',
        content: 'When Quinn woke, the sun was setting, painting the sky in shades of orange and pink. They were on a beach, white sand stretching in both directions. Five other figures lay scattered along the shoreline—their classmates: Mia, Tyler, Casey, Jordan, and Alex. All breathing. All alive. But where was the boat? Where was Captain Rodriguez? Where were the other students?\n\nAs consciousness returned to the others, the grim reality set in. They were stranded on an island with no idea where they were, no communication equipment, and no rescue in sight. The field trip had turned into a fight for survival.\n\nQuinn stood, brushing sand from their clothes, and looked at the dense jungle behind the beach. Somewhere in there, they would need to find shelter, water, and food. Six teenagers, alone on an unknown island. The adventure they never wanted had just begun.'
      }
    ],
    pageCount: 11,
  },
  {
    id: 'ch-5-2',
    bookId: 'book-5',
    title: 'First Night',
    description: 'Finding shelter and making fire become matters of survival.',
    featuredImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
    price: 2.49,
    isFree: false,
    sequence: 2,
    content: [
      {
        type: 'text',
        content: 'As darkness fell, panic threatened to set in. Mia, who had taken Marine Biology specifically because she loved the ocean from the safety of a boat, was close to hyperventilating. Tyler kept checking his phone even though it had died hours ago. Quinn knew they needed to take charge before fear overwhelmed them all.\n\n"Listen up," Quinn said, using their captain voice from soccer. "We need three things before it gets completely dark: shelter, water, and fire. Alex, you and Casey check the tree line for branches and palm fronds we can use for shelter. Tyler, Mia, look for dry wood. Jordan and I will search for fresh water. We meet back here in twenty minutes. Go."'
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1601572653358-4432dd6021f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBoaWtpbmclMjBuYXR1cmV8ZW58MXx8fHwxNzY3OTUxMDQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Jungle exploration',
        caption: 'Venturing into the unknown jungle to find supplies'
      },
      {
        type: 'text',
        content: 'The jungle was dense but navigable. Quinn and Jordan found a small stream about fifty meters inland, the water clear and cold. They filled their water bottles and marked the path back with broken branches.\n\nBack at the beach, Alex and Casey had gathered enough material to construct a basic lean-to against a large rock. Tyler and Mia returned with arms full of dry wood, and to everyone\'s surprise, Mia had also found coconuts.\n\nThe hardest part was making fire. Without matches or a lighter, they had to rely on the friction method Quinn had seen on survival shows. It took forty-five minutes of effort, rotating who worked the fire bow as hands got tired and blistered. But finally, a spark caught. Then smoke. Then flame.\n\nAs they sat around their first fire, sharing pieces of coconut and boiling stream water in Tyler\'s metal water bottle, the six teenagers realized something: they could do this. They would survive this. Together.'
      }
    ],
    pageCount: 13,
  },
  // Book 6 - Your First Million Steps
  {
    id: 'ch-6-1',
    bookId: 'book-6',
    title: 'Why Start Now?',
    description: 'Understanding why your teen years are perfect for entrepreneurship.',
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
    price: 0,
    isFree: true,
    sequence: 1,
    content: [
      { type: 'text', content: 'You\'re too young to start a business. You should focus on school. You don\'t have enough experience. Sound familiar? If you\'re a teenager interested in entrepreneurship, you\'ve probably heard these statements more times than you can count. But here\'s the truth: your teen years might be the perfect time to start...' },
    ],
    pageCount: 9,
  },
];