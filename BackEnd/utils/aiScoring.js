/**
 * ============================================
 * AI SCORING ENGINE FOR ATS
 * ============================================
 * This utility calculates AI-based match scores for applications
 * by comparing candidate skills with job requirements
 */

/**
 * Normalizes text by converting to lowercase and removing extra spaces
 */
const normalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().trim();
};

/**
 * Extracts skills from a text (simulating PDF parsing)
 * In production, this would parse actual PDF resume content
 */
export const extractSkillsFromResume = (resumeText, userExperience = [], userSkills = []) => {
  if (!resumeText) resumeText = "";
  
  // Common tech skills/keywords to look for
  const commonSkills = [
    "javascript", "python", "java", "c++", "c#", "ruby", "php", "golang", "rust", "typescript",
    "react", "angular", "vue", "svelte", "next.js", "nuxt",
    "node.js", "express", "django", "flask", "fastapi", "spring", "asp.net",
    "mongodb", "postgresql", "mysql", "sql", "firebase", "redis", "cassandra",
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform",
    "git", "linux", "unix", "windows", "macos",
    "html", "css", "sass", "tailwindcss", "bootstrap", "material",
    "rest", "graphql", "grpc", "websockets", "api",
    "machine learning", "deep learning", "tensorflow", "pytorch", "keras", "numpy", "pandas",
    "agile", "scrum", "kanban", "jira", "confluence",
    "testing", "jest", "mocha", "pytest", "junit", "cypress",
    "communication", "leadership", "problem-solving", "teamwork", "project management"
  ];

  const combinedText = `${resumeText} ${userExperience.join(" ")} ${userSkills.join(" ")}`.toLowerCase();
  
  const extractedSkills = new Set();
  commonSkills.forEach(skill => {
    if (combinedText.includes(skill)) {
      extractedSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  // Add user's existing skills
  if (Array.isArray(userSkills) && userSkills.length > 0) {
    userSkills.forEach(skill => extractedSkills.add(skill));
  }

  return Array.from(extractedSkills);
};

/**
 * Calculates the AI match score between job requirements and candidate skills
 * Returns a score from 0-100 and detailed breakdown
 */
export const calculateAIScore = (
  jobRequiredSkills = [],
  extractedCandidateSkills = [],
  candidateExperience = [],
  jobDescription = ""
) => {
  // Initialize score components
  let skillMatchCount = 0;
  let exactMatches = [];
  let partialMatches = [];
  let missingSkills = [];

  // Normalize job skills to lowercase for comparison
  const normalizedJobSkills = jobRequiredSkills.map(s => normalizeText(s));
  const normalizedCandidateSkills = extractedCandidateSkills.map(s => normalizeText(s));

  // Check for skill matches
  normalizedJobSkills.forEach((jobSkill, index) => {
    if (normalizedCandidateSkills.includes(jobSkill)) {
      skillMatchCount++;
      exactMatches.push(jobRequiredSkills[index]);
    } else if (normalizedCandidateSkills.some(cSkill => 
      cSkill.includes(jobSkill) || jobSkill.includes(cSkill)
    )) {
      // Partial match (e.g., "node" matches "node.js")
      partialMatches.push(jobRequiredSkills[index]);
    } else {
      missingSkills.push(jobRequiredSkills[index]);
    }
  });

  // Calculate base score (0-100)
  const skillMatchPercentage = jobRequiredSkills.length > 0 
    ? (skillMatchCount / jobRequiredSkills.length) * 100 
    : 0;

  // Partial match bonus (worth 50% of full match)
  const partialMatchBonus = (partialMatches.length / Math.max(jobRequiredSkills.length, 1)) * 50;

  let baseScore = skillMatchPercentage + partialMatchBonus;

  // Experience level boost (if candidate has 5+ years of experience)
  let experienceBoost = 0;
  if (Array.isArray(candidateExperience) && candidateExperience.length >= 2) {
    experienceBoost = 10;
  }

  // Calculate final score (cap at 100)
  const finalScore = Math.min(100, Math.round(baseScore + experienceBoost));

  // Generate AI Summary
  const summary = generateAISummary(
    exactMatches,
    partialMatches,
    missingSkills,
    finalScore,
    candidateExperience
  );

  return {
    aiScore: finalScore,
    aiSummary: summary,
    extractedSkills: extractedCandidateSkills,
    matchDetails: {
      exactMatches,
      partialMatches,
      missingSkills,
      skillMatchPercentage: Math.round(skillMatchPercentage),
      experienceBoost
    }
  };
};

/**
 * Generates a human-readable AI summary for the match
 */
const generateAISummary = (exactMatches, partialMatches, missingSkills, score, experience) => {
  let summary = "";

  // Strengths
  if (exactMatches.length > 0) {
    summary += `✓ STRENGTHS: Strong match with ${exactMatches.join(", ")}. `;
  }

  // Good to have
  if (partialMatches.length > 0) {
    summary += `⚡ BONUS: Has related skills in ${partialMatches.join(", ")}. `;
  }

  // Areas to develop
  if (missingSkills.length > 0 && missingSkills.length <= 3) {
    summary += `→ GAPS: Could develop ${missingSkills.join(", ")}. `;
  } else if (missingSkills.length > 3) {
    summary += `→ GAPS: Missing ${missingSkills.length} key requirements. `;
  }

  // Overall recommendation
  if (score >= 80) {
    summary += "🎯 RECOMMENDATION: Excellent fit - Highly recommended for interview.";
  } else if (score >= 60) {
    summary += "🤝 RECOMMENDATION: Good fit - Consider for interview.";
  } else if (score >= 40) {
    summary += "⏳ RECOMMENDATION: Moderate fit - May require training.";
  } else {
    summary += "❌ RECOMMENDATION: Limited fit - Alternative candidates suggested.";
  }

  return summary;
};

/**
 * Calculates match percentage for applicant filtering
 */
export const calculateMatchPercentage = (aiScore) => {
  if (!aiScore && aiScore !== 0) return 0;
  return Math.round(aiScore);
};

/**
 * Gets recommendation level based on score
 */
export const getRecommendationLevel = (score) => {
  if (score >= 80) return "Highly Recommended";
  if (score >= 60) return "Recommended";
  if (score >= 40) return "Consider";
  return "Not Recommended";
};

export default {
  extractSkillsFromResume,
  calculateAIScore,
  calculateMatchPercentage,
  getRecommendationLevel
};
