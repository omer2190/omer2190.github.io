// ==========================================
// DATA MANAGER - SUPABASE INTEGRATION
// Fetches/Saves data directly to Supabase
// ==========================================

import { getSupabase } from "../../assets/js/config/supabase.js";

const supabase = getSupabase();

class DataManager {
  constructor() {
    this.storageKey = "portfolio_data"; // Fallback for offline or cached data
  }

  // Helper to handle Supabase responses
  async handleSupabaseResponse(prompt, { data, error }) {
    if (error) {
      console.error(`Supabase Error (${prompt}):`, error);
      return { success: false, message: error.message };
    }
    return { success: true, data };
  }

  // Get projects from Supabase
  async getProjects(lang = "ar") {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      // Transform data if needed for frontend consumption
      // Add 'id' property if not present (Supabase returns 'id', keeping consistency)
      return data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return []; // Return empty array on error to prevent crashes
    }
  }

  // Add project to Supabase
  async addProject(projectData, lang = "ar") {
    try {
      // Prepare data for insertion (match schema)
      const newProject = {
        title_ar: projectData.title_ar || projectData.title, // Handle different input formats
        title_en: projectData.title_en || projectData.title,
        description_ar: projectData.description_ar || projectData.description,
        description_en: projectData.description_en || projectData.description,
        content_ar: projectData.content_ar, // New
        content_en: projectData.content_en, // New
        link: projectData.link, // New
        year: projectData.year,
        tags: projectData.tags,
        image_count: projectData.imageCount || 0,
      };

      // Add images array if present (requires 'images' column in DB)
      if (projectData.images) {
        newProject.images = projectData.images;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([newProject])
        .select();

      return this.handleSupabaseResponse("Add Project", { data, error });
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Update project in Supabase
  async updateProject(projectId, projectData, lang = "ar") {
    try {
      // Filter out only valid columns to avoid errors if extra data is passed
      const updateData = { ...projectData };
      delete updateData.id;

      // We rely on dashboard.js passing the correct keys.
      // But we should ensure we don't send 'success' or 'message' etc.

      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId)
        .select();

      return this.handleSupabaseResponse("Update Project", { data, error });
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Delete project from Supabase
  async deleteProject(projectId, lang = "ar") {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      return this.handleSupabaseResponse("Delete Project", {
        data: null,
        error,
      });
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get skills from Supabase
  async getSkills() {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("progress", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
  }

  // Add/Update skills
  async updateSkill(skillData) {
    // Check if ID exists to update, else insert
    if (skillData.id) {
      const { data, error } = await supabase
        .from("skills")
        .update(skillData)
        .eq("id", skillData.id);
      return this.handleSupabaseResponse("Update Skill", { data, error });
    } else {
      const { data, error } = await supabase.from("skills").insert([skillData]);
      return this.handleSupabaseResponse("Add Skill", { data, error });
    }
  }

  async deleteSkill(skillId) {
    const { error } = await supabase.from("skills").delete().eq("id", skillId);
    return this.handleSupabaseResponse("Delete Skill", { data: null, error });
  }

  // Get Profile/Contact Info
  async getProfile() {
    try {
      const { data, error } = await supabase.from("profile").select("*");

      if (error) throw error;

      // Transform array to object for easier consumption { key: value }
      const profile = {};
      data.forEach((item) => {
        if (!profile[item.category]) profile[item.category] = {};
        profile[item.category][item.key] = item.value;
      });
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return {};
    }
  }

  // Update Profile Info
  async updateProfile(category, key, value) {
    // Check if exists, update or insert
    try {
      // Upsert requires a unique constraint. We have a unique constraint on 'key' (assuming global uniqueness or category+key uniqueness)
      // Adjust schema if needed. Our schema has 'key' unique.
      const { data, error } = await supabase
        .from("profile")
        .upsert({ category, key, value }, { onConflict: "key" });

      return this.handleSupabaseResponse("Update Profile", { data, error });
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // ==========================================
  // STORAGE (Images)
  // ==========================================

  async uploadImage(file, path) {
    try {
      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(path);

      return { success: true, url: publicUrlData.publicUrl };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const dataManager = new DataManager();
window.dataManager = dataManager; // Expose to window for global access
export { dataManager };
