import React from "react";

const BlogPage: React.FC = () => {
    return (
        <div>
            <h1>Blog</h1>
            <p>This is the blog page that was automatically discovered!</p>
            <div>
                <h2>Recent Posts</h2>
                <ul>
                    <li>Getting Started with React SSR</li>
                    <li>File-based Routing Best Practices</li>
                    <li>Code Splitting Strategies</li>
                </ul>
            </div>
        </div>
    );
};

export default BlogPage;
