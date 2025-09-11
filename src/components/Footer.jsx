import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/anupkundu2024",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/anupkundu-linkdin/",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "https://x.com/anupkundu_",
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "https://www.facebook.com/profile.php?id=61563913023455",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/anupkundu__/",
    },
    {
      name: "Fiverr",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M23.004 15.588a.995.995 0 1 1 .002-1.99.995.995 0 0 1-.002 1.99zm-.996-3.705v-.287c0-.676-.57-1.134-1.239-1.134-.673 0-1.239.458-1.239 1.134v2.587c0 .677.57 1.134 1.239 1.134.676 0 1.239-.457 1.239-1.134v-.544h-1.125v.544h-.228v-2.587h.228v.287h1.125zm-3.145-1.421c-.791 0-1.239.458-1.239 1.134v2.587c0 .677.451 1.134 1.239 1.134.788 0 1.238-.457 1.238-1.134v-2.587c0-.676-.453-1.134-1.238-1.134zm.113 3.721c0 .677-.113.567-.113.567-.228 0-.228-.567-.228-.567v-2.587c0-.676.228-.567.228-.567.113 0 .113.567.113.567v2.587zm-2.995-3.721c-.788 0-1.239.458-1.239 1.134v2.587c0 .677.454 1.134 1.239 1.134.788 0 1.238-.457 1.238-1.134v-2.587c0-.676-.453-1.134-1.238-1.134zm.113 3.721c0 .677-.113.567-.113.567-.228 0-.228-.567-.228-.567v-2.587c0-.676.228-.567.228-.567.113 0 .113.567.113.567v2.587zm-3.053-3.721v4.855h1.125v-4.855h-1.125zm-.571 0h-1.011l-.909 1.98h-.228v-1.98h-1.125v4.855h1.125v-1.981h.228l.909 1.981h1.011l-1.068-2.267 1.068-2.588zm-4.594 0l-.682 4.855h1.125l.455-3.883h.228l.455 3.883h1.125l-.682-4.855h-2.024zm-1.125 0h-1.125v4.855h1.125v-4.855zm-1.577-3.883c.171-.171.171-.451 0-.676l-.682-.791h-2.25v6.376h2.25l.682-.791c.171-.228.171-.508 0-.676l-.455-.508c-.117-.228-.117-.508 0-.676l.455-.508c.117-.225.117-.505 0-.733l-.455-.508c-.117-.228-.117-.508 0-.676l.455-.833zm-1.807 3.883h-.228v-.901h.228c.343 0 .343.901 0 .901zm0-1.697h-.228v-.904h.228c.343 0 .343.904 0 .904zm0-1.697h-.228v-.904h.228c.343 0 .343.904 0 .904z" />
        </svg>
      ),
      url: "https://www.fiverr.com/anup_kundu2024/buying?source=avatar_menu_profile",
    },
    {
      name: "Linktree",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.92,2.44a1.06,1.06,0,0,0-1.86,0L.1,15.07A1,1,0,0,0,1,16.44h4.7v4.78a.9.9,0,0,0,.89.89H9.33a.91.91,0,0,0,.89-.89V16.44H8.92a1.05,1.05,0,0,1-1-.89A1,1,0,0,1,8,15l3.89-6.92Z" />
          <path d="M15.08,2.44a1.06,1.06,0,0,1,1.86,0l7,12.63A1,1,0,0,1,23,16.44H18.3v4.78a.9.9,0,0,1-.89.89H14.67a.91.91,0,0,1-.89-.89V16.44h1.3a1.05,1.05,0,0,0,1-.89,1,1,0,0,0-.1-.55L12.08,8.08Z" />
        </svg>
      ),
      url: "https://linktr.ee/anup_kundu",
    },
  ];

  return (
    <footer className="border-t border-border/20 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              © 2025 Anup. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Built with React, Three.js & lots of ☕
            </p>
          </div>

          <div className="flex gap-6 flex-wrap justify-center">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:scale-110 transform duration-200"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
