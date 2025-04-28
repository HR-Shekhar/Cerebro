import { useState } from 'react';
import { Search, BookOpen, Star, Filter, ExternalLink } from 'lucide-react';

export default function PopularCourses() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Computer Science', 'Data Science', 'AI & Machine Learning', 'Business', 'Health'];
  
  const courses = [
    {
      id: 1,
      title: "CS50: Introduction to Computer Science",
      provider: "Harvard University",
      platform: "edX",
      category: "Computer Science",
      rating: 4.9,
      students: "3.2M+",
      image: "/api/placeholder/360/240",
      link: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
      featured: true,
      description: "Harvard's introduction to the intellectual enterprises of computer science and programming."
    },
    {
      id: 2,
      title: "Deep Learning Specialization",
      provider: "deeplearning.ai",
      platform: "Coursera",
      category: "AI & Machine Learning",
      rating: 4.8,
      students: "1.1M+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/specializations/deep-learning",
      featured: true,
      description: "Learn the foundations of Deep Learning, understand how to build neural networks, and lead ML projects."
    },
    {
      id: 3,
      title: "Machine Learning",
      provider: "Stanford University",
      platform: "Coursera",
      category: "AI & Machine Learning",
      rating: 4.9,
      students: "4.8M+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/learn/machine-learning",
      featured: true,
      description: "This course provides a broad introduction to machine learning, datamining, and statistical pattern recognition."
    },
    {
      id: 4,
      title: "Python for Everybody",
      provider: "University of Michigan",
      platform: "Coursera",
      category: "Computer Science",
      rating: 4.8,
      students: "2.3M+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/specializations/python",
      featured: false,
      description: "Learn to Program and Analyze Data with Python. Develop programs to gather, clean, analyze, and visualize data."
    },
    {
      id: 5,
      title: "Data Science Specialization",
      provider: "Johns Hopkins University",
      platform: "Coursera",
      category: "Data Science",
      rating: 4.6,
      students: "950K+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/specializations/jhu-data-science",
      featured: false,
      description: "Launch your career in data science. A ten-course introduction to data science developed and taught by leading professors."
    },
    {
      id: 6,
      title: "The Science of Well-Being",
      provider: "Yale University",
      platform: "Coursera",
      category: "Health",
      rating: 4.9,
      students: "3.9M+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/learn/the-science-of-well-being",
      featured: false,
      description: "In this course you will engage in a series of challenges designed to increase your own happiness."
    },
    {
      id: 7,
      title: "Google Data Analytics Certificate",
      provider: "Google",
      platform: "Coursera",
      category: "Data Science",
      rating: 4.8,
      students: "1.5M+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/professional-certificates/google-data-analytics",
      featured: true,
      description: "Get ready for a new career in the high-growth field of data analytics, no experience or degree required."
    },
    {
      id: 8,
      title: "Financial Markets",
      provider: "Yale University",
      platform: "Coursera",
      category: "Business",
      rating: 4.7,
      students: "670K+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/learn/financial-markets-global",
      featured: false,
      description: "An overview of the ideas, methods, and institutions that permit human society to manage risks and foster enterprise."
    },
    {
      id: 9,
      title: "CS50's Web Programming with Python and JavaScript",
      provider: "Harvard University",
      platform: "edX",
      category: "Computer Science",
      rating: 4.8,
      students: "520K+",
      image: "/api/placeholder/360/240",
      link: "https://www.edx.org/course/cs50s-web-programming-with-python-and-javascript",
      featured: false,
      description: "This course picks up where CS50 leaves off, diving more deeply into the design and implementation of web apps with Python and JavaScript."
    },
    {
      id: 10,
      title: "Artificial Intelligence for Everyone",
      provider: "deeplearning.ai",
      platform: "Coursera",
      category: "AI & Machine Learning",
      rating: 4.8,
      students: "580K+",
      image: "/api/placeholder/360/240",
      link: "https://www.coursera.org/learn/ai-for-everyone",
      featured: false,
      description: "AI is not only for engineers. This non-technical course will help you understand AI technologies and spot opportunities in your organization."
    }
  ];

  // Filter courses based on active category and search query
  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured courses
  const featuredCourses = courses.filter(course => course.featured);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Discover World-Class Online Courses</h1>
            <p className="text-xl mb-8">Explore top-rated courses from leading universities and institutions</p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-transparent rounded-lg bg-gray-800 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white"
                placeholder="Search for courses, topics, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-300 mr-4">Filter by:</span>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full mr-2 ${
                activeCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Courses Section */}
        {searchQuery === '' && activeCategory === 'All' && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map(course => (
                <div key={course.id} className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-blue-900/50 hover:shadow-lg hover:scale-105 border border-gray-700">
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover opacity-90" />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 m-2 rounded">
                      FEATURED
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-400 mb-1">
                      <span>{course.provider}</span>
                      <span className="mx-2">•</span>
                      <span>{course.platform}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-100">{course.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-300">{course.rating}</span>
                        <span className="ml-2 text-xs text-gray-500">({course.students} students)</span>
                      </div>
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium"
                      >
                        View Course
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Courses Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">
            {searchQuery !== '' ? 'Search Results' : activeCategory === 'All' ? 'All Courses' : `${activeCategory} Courses`}
          </h2>
          
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No courses found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-blue-900/50 hover:shadow-lg transition-all duration-300 border border-gray-700">
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover opacity-90" />
                    <div className={`absolute bottom-0 left-0 px-3 py-1 m-2 rounded text-xs font-bold ${
                      course.category === 'Computer Science' ? 'bg-blue-600 text-white' :
                      course.category === 'Data Science' ? 'bg-purple-600 text-white' :
                      course.category === 'AI & Machine Learning' ? 'bg-green-600 text-white' :
                      course.category === 'Business' ? 'bg-orange-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {course.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-400 mb-1">
                      <span>{course.provider}</span>
                      <span className="mx-2">•</span>
                      <span>{course.platform}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-100">{course.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-300">{course.rating}</span>
                        <span className="ml-2 text-xs text-gray-500">({course.students} students)</span>
                      </div>
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        View Course
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-8 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Popular Courses</h3>
              <p className="text-gray-400 text-sm mt-1">Find the best online learning experiences</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/watch?v=OvKCESUCWII&list=PLhQjrBD2T3817j24-GogXmWqO5Q5vYy0V" className="text-gray-400 hover:text-blue-400 transition-colors">About</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Popular Courses. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}