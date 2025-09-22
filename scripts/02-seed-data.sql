-- Sample data for BUILDRS
INSERT INTO profiles (username, display_name, bio, builder_score, total_upvotes, build_streak, github_username, twitter_username) VALUES
('sarahbuilds', 'Sarah Chen', 'Frontend engineer building tools for developers. React, TypeScript, design systems.', 742, 89, 3, 'sarahchen', 'sarahbuilds'),
('alexdev', 'Alex Rodriguez', 'Full-stack developer passionate about AI and developer experience.', 850, 127, 5, 'alexdev', 'alexdev'),
('mikecodes', 'Mike Johnson', 'Backend engineer specializing in distributed systems and APIs.', 623, 67, 2, 'mikejohnson', 'mikecodes'),
('designerjane', 'Jane Smith', 'Product designer who codes. Building beautiful, accessible interfaces.', 591, 78, 4, 'janesmith', 'designerjane');

INSERT INTO builds (user_id, type, title, description, tags, demo_url, github_url, upvotes, downvotes, comment_count) VALUES
((SELECT id FROM profiles WHERE username = 'sarahbuilds'), 'launch', 'DevUI Component Library', 'Production-ready React components with TypeScript support. 50+ components, dark mode, full accessibility.', '{"react", "typescript", "ui-library"}', 'https://devui.sarahbuilds.com', 'https://github.com/sarahchen/devui', 23, 1, 8),
((SELECT id FROM profiles WHERE username = 'alexdev'), 'launch', 'AI Code Review Tool', 'Automated code review using GPT-4. Integrates with GitHub PRs and provides intelligent feedback.', '{"ai", "developer-tools", "github"}', 'https://codereview.alexdev.com', 'https://github.com/alexdev/ai-review', 45, 2, 12),
((SELECT id FROM profiles WHERE username = 'sarahbuilds'), 'experiment', 'AI Commit Message Generator', 'Testing GPT-4 for generating semantic commit messages from git diffs. Early prototype, 70% accuracy so far.', '{"ai", "git", "developer-tools"}', NULL, 'https://github.com/sarahchen/ai-commit-experiment', 12, 0, 5),
((SELECT id FROM profiles WHERE username = 'mikecodes'), 'launch', 'Serverless API Framework', 'Lightweight framework for building serverless APIs with TypeScript. Built-in validation, auth, and monitoring.', '{"serverless", "typescript", "api"}', 'https://serverless-api.mikecodes.dev', 'https://github.com/mikejohnson/serverless-api', 34, 1, 9),
((SELECT id FROM profiles WHERE username = 'designerjane'), 'update', 'Design System v2.0', 'Major update to our design system with new components, improved accessibility, and Figma integration.', '{"design-system", "figma", "accessibility"}', 'https://designsystem.janesmith.com', 'https://github.com/janesmith/design-system', 28, 0, 6);
