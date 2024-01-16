type BeaconEvent = [string, any];

export default class BetterBeacon {
  config: {
    autoTransformJSON: boolean;
  };

  queue: Array<BeaconEvent> = [];

  processing: boolean = false;

  constructor({
    autoTransformJSON = false,
  } = {}) {
    this.config = {
      autoTransformJSON,
    };

    if (typeof navigator.sendBeacon !== "function") {
      throw new Error(`Your browser doesn't support navigator.sendBeacon`);
    }
    if (typeof window.requestAnimationFrame !== "function") {
      throw new Error(`Your browser doesn't support window.requestAnimationFrame`);
    }

    window.addEventListener("beforeunload", this.beforeUnload);
  }

  beforeUnload() {
    if (this.queue.length) {
      this.queue.forEach(([path, data]) => {
        this.send(path, data);
      });
    }
  }

  send(path: string, data: any) {
    if (this.config.autoTransformJSON && typeof data === "object") {
      data = new Blob([JSON.stringify(data)], { type: "application/json" });
    }

    this.queue.push([path, data]);
    this.processEvents();
  }

  // processEvents() {
  //   this.processing = true;
  //   // iterate through the queue and send the data using navigator.sendBeacon
  //   // if the sendBeacon call returns false, we want to re-enqueue the data
  //   // exit the loop, and schedule to resume the loop via requestAnimationFrame
  //   // if the sendBeacon call returns true, we want to remove the data from the queue
  //   // and continue the loop
  //   // if the queue is empty, exit the loop
  //   // schedule to resume the loop via requestAnimationFrame
  //   while (this.queue.length && this.processing) {
  //     let [path, data] = this.queue.shift();
  //     let result = navigator.sendBeacon(path, data);
  //     if (!result) {
  //       this.queue.unshift([path, data]);
  //       window.requestAnimationFrame(this.processEvents);
  //       this.processing = false;
  //       break;
  //     }
  //   }
  //   this.processing = false;
  // }
  processEvents() {
    if (this.processing) {
      return;
    }
    let success = true;
    while (success && this.queue.length) {
      let [path, data] = this.queue.shift();
      success = navigator.sendBeacon(path, data);
      if (!success) {
        this.queue.unshift([path, data]);
      }
    }
    if (this.queue.length) {
      this.processing = true;
      window.requestAnimationFrame(() => {
        this.processing = false;
        this.processEvents();
      });
    }
  }
}
