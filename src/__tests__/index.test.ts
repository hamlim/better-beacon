import { expect, jest, test } from "bun:test";

import BetterBeacon from "../index";

// test("BetterBeacon - throws for no sendBeacon API", () => {
//   let originalSendBeacon = navigator.sendBeacon;
//   // @ts-expect-error
//   navigator.sendBeacon = undefined;
//   expect(() => new BetterBeacon()).toThrow();
//   navigator.sendBeacon = originalSendBeacon;
// });

// test("BetterBeacon - throws for no requestAnimationFrame API", () => {
//   let originalRequestAnimationFrame = window.requestAnimationFrame;
//   // @ts-expect-error
//   window.requestAnimationFrame = undefined;
//   expect(() => new BetterBeacon()).toThrow();
//   window.requestAnimationFrame = originalRequestAnimationFrame;
// });

// test("BetterBeacon - sends data", () => {
//   let originalSendBeacon = navigator.sendBeacon;
//   let sendBeacon = jest.fn();
//   navigator.sendBeacon = sendBeacon;
//   let bb = new BetterBeacon();
//   bb.send("/test", { foo: "bar" });
//   expect(sendBeacon).toHaveBeenCalled();
//   navigator.sendBeacon = originalSendBeacon;
// });

test.only("BetterBeacon - properly queues the changes and processes them in a loop", () => {
  console.log("Start");
  let originalRequestAnimationFrame = window.requestAnimationFrame;
  let animationFrameCallbacks: Array<FrameRequestCallback> = [];
  window.requestAnimationFrame = cb => {
    animationFrameCallbacks.push(cb);
    return 1;
  };
  let count = 0;
  let calls: Array<{ event: string; data: any }> = [];
  let sendBeacon = (event, data) => {
    console.log("Here?!?!?!");
    calls.push({ event, data });
    count++;
    return count < 2;
  };
  let originalSendBeacon = navigator.sendBeacon;
  navigator.sendBeacon = sendBeacon;
  let bb = new BetterBeacon();
  bb.send("/test", { foo: "bar" });
  bb.send("/test", { foo: "bar" });
  bb.send("/test", { foo: "bar" });
  // expect(calls.length).toBe(2);
  // expect(animationFrameCallbacks.length).toBe(1);
  count = 0;
  // animationFrameCallbacks[0](0);
  // expect(calls.length).toBe(3);
  navigator.sendBeacon = originalSendBeacon;
  window.requestAnimationFrame = originalRequestAnimationFrame;
});
