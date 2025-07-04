import fs from "fs-extra";
import path from "path";

class MockDataGenerator {
  constructor() {
    this.dataPath = "./data/mock-health-data/";
  }

  async generateMockData() {
    await fs.ensureDir(this.dataPath);

    // Generate activity data
    const activityData = this.generateActivityData();
    await fs.writeJson(
      path.join(this.dataPath, "activity_data.json"),
      activityData,
      { spaces: 2 }
    );

    // Generate sleep data
    const sleepData = this.generateSleepData();
    await fs.writeJson(path.join(this.dataPath, "sleep_data.json"), sleepData, {
      spaces: 2,
    });

    // Generate HRV data
    const hrvData = this.generateHRVData();
    await fs.writeJson(path.join(this.dataPath, "hrv_data.json"), hrvData, {
      spaces: 2,
    });

    // Generate nutrition data
    const nutritionData = this.generateNutritionData();
    await fs.writeJson(
      path.join(this.dataPath, "nutrition_data.json"),
      nutritionData,
      { spaces: 2 }
    );

    // Generate stress data
    const stressData = this.generateStressData();
    await fs.writeJson(
      path.join(this.dataPath, "stress_data.json"),
      stressData,
      { spaces: 2 }
    );

    console.log("Mock data generated successfully!");
  }

  generateActivityData() {
    const activities = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      activities.push({
        id: `activity_${i}`,
        Date: date.toISOString().split("T")[0],
        Duration: this.randomTime(30, 90),
        Steps: this.randomInt(8000, 15000),
        Distance: this.randomFloat(5, 12),
        "Elevation Gain": this.randomInt(50, 300),
        "Avg HR": this.randomInt(140, 170),
        "Max HR": this.randomInt(175, 190),
        Calories: this.randomInt(400, 800),
        "Training Load": this.randomInt(150, 300),
      });
    }

    return activities;
  }

  generateSleepData() {
    const sleepData = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      sleepData.push({
        id: `sleep_${i}`,
        Date: date.toISOString().split("T")[0],
        Total: this.randomTime(6, 9, true),
        Awake: this.randomTime(0, 1),
        "Restless Moments": this.randomInt(5, 20),
        Light: this.randomTime(3, 5, true),
        Deep: this.randomTime(1, 2, true),
        Rem: this.randomTime(1, 2, true),
        Stress: this.randomInt(15, 45),
        "Lowest SPO2": this.randomInt(92, 97),
        "Avg SPO2": this.randomInt(95, 99),
        "Avg HRV": this.randomInt(35, 65),
        "Avg Respiration": this.randomInt(12, 18),
        "Lowest Respiration": this.randomInt(10, 14),
        "Resting Heart Rate": this.randomInt(45, 65),
      });
    }

    return sleepData;
  }

  generateHRVData() {
    const hrvData = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      hrvData.push({
        id: `hrv_${i}`,
        Date: date.toISOString().split("T")[0],
        "HRV Measure Time": "07:00",
        "HRV Night Avg": this.randomInt(35, 65),
        "HRV Night Max": this.randomInt(70, 90),
      });
    }

    return hrvData;
  }

  generateNutritionData() {
    return [
      {
        Food: "Scrambled eggs (2 large)",
        ServingSize: "100g",
        Date: new Date().toISOString().split("T")[0],
        Time: "08:00 AM",
      },
      {
        Food: "Sourdough bread (1 slice)",
        ServingSize: "30g",
        Date: new Date().toISOString().split("T")[0],
        Time: "08:00 AM",
      },
    ];
  }

  generateStressData() {
    const stressData = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      stressData.push({
        id: `stress_${i}`,
        Date: date.toISOString().split("T")[0],
        Avg: this.randomInt(20, 50),
        Rest: this.randomTime(8, 12, true),
        Low: this.randomTime(6, 10, true),
        "Medium Stress": this.randomTime(2, 4, true),
        "High Stress": this.randomTime(0, 2, true),
      });
    }

    return stressData;
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomFloat(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  }

  randomTime(minHours, maxHours, includeMinutes = false) {
    const hours = this.randomInt(minHours, maxHours);
    const minutes = includeMinutes ? this.randomInt(0, 59) : 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }
}

export default MockDataGenerator;
