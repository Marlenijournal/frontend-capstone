// diabetes-presenter.js
import {
  predictDiabetesAsUser,
  getAllDiabetesUserHistory,
  deleteDiabatesUserHistory,
} from "../../data/api.js";

export default class DiabetesPresenterUser {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async handleFileUpload(file) {
    this.#view.showLoading();

    try {
      const data = await predictDiabetesAsUser(file);
      this.#view.displayResults(data);
      // Refresh history after new prediction
      await this.loadHistory();
    } catch (error) {
      this.#view.displayError(error);
    }
  }

  // diabetes-presenter.js
  async loadHistory() {
    try {
      const history = await getAllDiabetesUserHistory();
      // Sort by createdAt in descending order (newest first)
      const sortedHistory = history.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      this.#view.displayHistory(sortedHistory);
    } catch (error) {
      this.#view.displayHistoryError(error);
    }
  }

  async deleteHistoryItem(id) {
    try {
      await deleteDiabatesUserHistory(id);
      // Refresh history setelah delete
      await this.loadHistory();
      return true;
    } catch (error) {
      console.error("Failed to delete history item:", error);
      throw error;
    }
  }
}
