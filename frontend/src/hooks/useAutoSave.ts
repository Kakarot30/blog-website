/**
 * useAutoSave Hook
 * A custom React hook that provides auto-saving functionality for form data
 * Features:
 * - Automatic saving at specified intervals
 * - Manual save capability
 * - Save status tracking
 * - Last saved time tracking
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { BlogData, saveDraft } from '../services/api';

// Props interface for the useAutoSave hook
interface UseAutoSaveProps {
  initialData: BlogData;      // Initial data to start with
  delay?: number;             // Delay between auto-saves in milliseconds
  onSave?: (data: any) => void;  // Callback function after successful save
}

const useAutoSave = ({ initialData, delay = 5000, onSave }: UseAutoSaveProps) => {
  // State management
  const [data, setData] = useState<BlogData>(initialData);          // Current data
  const [lastSavedData, setLastSavedData] = useState<BlogData>(initialData);  // Last successfully saved data
  const [isSaving, setIsSaving] = useState<boolean>(false);         // Save in progress indicator
  const [lastSaved, setLastSaved] = useState<Date | null>(null);    // Timestamp of last save
  const timerRef = useRef<NodeJS.Timeout | null>(null);            // Reference to auto-save timer
  
  // Update local data when initialData changes (e.g., when editing a different blog)
  useEffect(() => {
    console.log("useAutoSave: initialData changed, updating data", initialData);
    setData(initialData);
    setLastSavedData(initialData);
  }, [initialData]);
  
  // Update data with new changes
  const updateData = (updatedData: Partial<BlogData>) => {
    console.log("useAutoSave: updating data with", updatedData);
    setData(prevData => ({ ...prevData, ...updatedData }));
  };
  
  // Save data to the server
  const saveData = useCallback(async () => {
    // Only save if there are changes and we have a title
    if (JSON.stringify(data) !== JSON.stringify(lastSavedData) && data.title.trim() !== '') {
      console.log("useAutoSave: saving data with status:", data.status || 'draft');
      setIsSaving(true);
      try {
        // Prepare data for saving
        const dataToSave: BlogData = {
          ...data,
          status: 'draft' as const // Explicitly type as 'draft'
        };
        // Save to server
        const savedData = await saveDraft(dataToSave);
        console.log("useAutoSave: data saved successfully with status:", savedData.status);
        
        // Update local state
        setLastSavedData(savedData);
        setLastSaved(new Date());
        
        // Trigger callback if provided
        if (onSave) onSave(savedData);
        return savedData;
      } catch (error) {
        console.error('Auto-save failed:', error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log("useAutoSave: no changes to save or title is empty");
      return lastSavedData;
    }
  }, [data, lastSavedData, onSave]);

  // Manual save function
  const save = async () => {
    console.log("useAutoSave: manual save triggered");
    // Clear any pending auto-save
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const savedData = await saveData();
    return savedData;
  };
  
  // Auto-save effect with debounce
  useEffect(() => {
    // Only set up auto-save if data has changed from initial or last saved state
    if (JSON.stringify(data) !== JSON.stringify(initialData) && 
        JSON.stringify(data) !== JSON.stringify(lastSavedData)) {
      console.log("useAutoSave: setting up auto-save timer");
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set up new timer
      timerRef.current = setTimeout(async () => {
        console.log("useAutoSave: auto-save timer triggered");
        await saveData();
      }, delay);
    }
    
    // Cleanup timer on unmount or data change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, delay, saveData, initialData, lastSavedData]);
  
  // Return hook interface
  return {
    data,           // Current data state
    updateData,     // Function to update data
    isSaving,       // Whether a save is in progress
    lastSaved,      // Timestamp of last successful save
    save,           // Manual save function
  };
};

export default useAutoSave;