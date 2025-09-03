#!/usr/bin/env node

import { promises as fs } from 'fs';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const URLS = [
  'https://pritsinghlaw.com',
  'https://pritsinghlaw.com/services',
  'https://pritsinghlaw.com/about',
  'https://pritsinghlaw.com/services/real-estate-litigation',
  'https://pritsinghlaw.com/services/Landlord-Tenant-Matter',
  'https://pritsinghlaw.com/services/Premises-Liability',
  'https://pritsinghlaw.com/services/Boundary-Disputes',
  'https://pritsinghlaw.com/services/Quiet-Title',
  'https://pritsinghlaw.com/services/Contract-Drafting-Review',
  'https://pritsinghlaw.com/services/Purchase-Agreements',
  'https://pritsinghlaw.com/services/Adverse-Possession'
];

async function fetchPage(url) {
  try {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

function extractText(html, url) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Remove scripts and styles
  document.querySelectorAll('script, style, noscript').forEach(el => el.remove());
  
  // Remove navigation and footer
  document.querySelectorAll('nav, .navbar, .footer, .navbar-component, footer').forEach(el => el.remove());
  
  // Get title
  const title = document.querySelector('title')?.textContent || url;
  
  // Get main content
  let content = '';
  
  // Try to find main content areas
  const contentSelectors = [
    'main',
    '.main-wrapper',
    '.content',
    '.container',
    'article',
    '.hero',
    '.section'
  ];
  
  for (const selector of contentSelectors) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      content += ' ' + el.textContent;
    });
  }
  
  // Fallback to body if no content found
  if (!content.trim()) {
    content = document.body?.textContent || '';
  }
  
  // Clean up text
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 3000); // Limit length
  
  return { url, title: title.trim(), text: content };
}

async function buildKnowledge() {
  console.log('Building knowledge base...');
  
  const pages = [];
  
  for (const url of URLS) {
    const html = await fetchPage(url);
    if (html) {
      const pageData = extractText(html, url);
      if (pageData.text) {
        pages.push(pageData);
      }
    }
  }
  
  const knowledge = {
    version: '1.0',
    generated: new Date().toISOString(),
    pages
  };
  
  // Write to file
  await fs.writeFile(
    'data/knowledge.json',
    JSON.stringify(knowledge, null, 2),
    'utf8'
  );
  
  console.log(`Knowledge base created with ${pages.length} pages`);
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  buildKnowledge().catch(console.error);
}