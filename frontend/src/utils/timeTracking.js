class TimeTracker {
  constructor() {
    this.startTime = null;
    this.courseId = null;
    this.lessonId = null;
    this.isActive = false;
    this.accumulatedTime = 0;
  }

  start(courseId, lessonId) {
    if (this.isActive && this.courseId === courseId && this.lessonId === lessonId) {
      return; // Already tracking this lesson
    }

    // Save previous session if switching lessons
    if (this.isActive) {
      this.pause();
    }

    this.courseId = courseId;
    this.lessonId = lessonId;
    this.startTime = Date.now();
    this.isActive = true;
    this.accumulatedTime = 0;

    console.log(`Started tracking: Course ${courseId}, Lesson ${lessonId}`);
  }

  pause() {
    if (!this.isActive) return 0;

    const elapsed = Date.now() - this.startTime;
    this.accumulatedTime += elapsed;
    this.isActive = false;

    console.log(`Paused tracking: ${this.getMinutesSpent()} minutes`);
    return this.accumulatedTime;
  }

  resume() {
    if (this.isActive) return;
    this.startTime = Date.now();
    this.isActive = true;
  }

  getTimeSpent() {
    let total = this.accumulatedTime;
    if (this.isActive) {
      total += Date.now() - this.startTime;
    }
    return total; // milliseconds
  }

  getMinutesSpent() {
    return Math.floor(this.getTimeSpent() / 1000 / 60);
  }

  getHoursSpent() {
    return Number((this.getTimeSpent() / 1000 / 60 / 60).toFixed(2));
  }

  reset() {
    this.startTime = null;
    this.courseId = null;
    this.lessonId = null;
    this.isActive = false;
    this.accumulatedTime = 0;
  }
}

export const timeTracker = new TimeTracker();
