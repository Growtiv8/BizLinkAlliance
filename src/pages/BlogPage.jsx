import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Networking: Building Meaningful Connections',
    author: 'Jane Doe, CEO of ConnectSphere',
    date: '2025-09-10',
    snippet: 'Networking is more than just exchanging business cards. It\'s about building genuine relationships that can lead to long-term partnerships and opportunities. In this post, we explore strategies for effective networking...',
    category: 'Networking',
    image: 'A group of diverse professionals networking at a modern event'
  },
  {
    id: 2,
    title: '5 Digital Marketing Trends Sacramento Businesses Can\'t Ignore',
    author: 'John Smith, Marketing Guru',
    date: '2025-09-05',
    snippet: 'The digital landscape is constantly evolving. To stay ahead, Sacramento businesses need to adapt to the latest trends. From AI-powered marketing to the rise of short-form video, here are five trends you need to know...',
    category: 'Marketing',
    image: 'A person analyzing marketing data on a futuristic computer screen'
  },
  {
    id: 3,
    title: 'Scaling Your Startup: From Local Gem to Regional Player',
    author: 'Emily White, Founder of GrowthCo',
    date: '2025-08-28',
    snippet: 'Taking your startup to the next level requires careful planning and execution. This guide covers key aspects of scaling, including funding, team building, and market expansion within the Sacramento region and beyond...',
    category: 'Business Growth',
    image: 'A small plant growing into a large tree, symbolizing business growth'
  },
];

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Entrepreneurship Blog - BizLink Alliance</title>
        <meta name="description" content="Insights and articles on entrepreneurship, networking, and business growth for the Sacramento community from BizLink Alliance." />
      </Helmet>
      <div className="pt-16">
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold font-heading"
            >
              The <span className="gradient-text">BizLink Blog</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl text-light-grey max-w-3xl mx-auto font-body"
            >
              Your source for entrepreneurship insights, networking tips, and business growth strategies in the Sacramento area.
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col overflow-hidden rounded-2xl shadow-lg glass-effect business-card-hover"
                >
                  <div className="flex-shrink-0">
                    <img className="h-48 w-full object-cover" alt={post.title} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-gold font-body">
                        <a href="#" className="hover:underline">{post.category}</a>
                      </p>
                      <a href="#" className="mt-2 block">
                        <p className="text-xl font-semibold text-white font-heading">{post.title}</p>
                        <p className="mt-3 text-base text-light-grey font-body">{post.snippet}</p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <span className="sr-only">{post.author}</span>
                        <div className="h-10 w-10 rounded-full bg-dark-grey flex items-center justify-center">
                          <User className="h-6 w-6 text-light-grey" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white font-body">{post.author}</p>
                        <div className="flex space-x-1 text-sm text-dark-grey font-body">
                          <time dateTime={post.date}>{post.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;