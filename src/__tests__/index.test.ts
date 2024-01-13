import { expect, jest, test } from "bun:test";

import BetterBeacon from "../index";

test("BetterBeacon - throws for no sendBeacon API", () => {
  let originalSendBeacon = navigator.sendBeacon;
  // @ts-expect-error
  navigator.sendBeacon = undefined;
  expect(() => new BetterBeacon()).toThrow();
  navigator.sendBeacon = originalSendBeacon;
});

test("BetterBeacon - throws for no requestAnimationFrame API", () => {
  let originalRequestAnimationFrame = window.requestAnimationFrame;
  // @ts-expect-error
  window.requestAnimationFrame = undefined;
  expect(() => new BetterBeacon()).toThrow();
  window.requestAnimationFrame = originalRequestAnimationFrame;
});

test("BetterBeacon - sends data", () => {
  let originalSendBeacon = navigator.sendBeacon;
  let sendBeacon = jest.fn();
  navigator.sendBeacon = sendBeacon;
  let bb = new BetterBeacon();
  bb.send("/test", { foo: "bar" });
  expect(sendBeacon).toHaveBeenCalled();
  navigator.sendBeacon = originalSendBeacon;
});

test.skip("BetterBeacon - properly queues the changes and processes them in a loop", () => {
  console.log("Start");
  let originalRequestAnimationFrame = window.requestAnimationFrame;
  let animationFrameCallbacks: Array<FrameRequestCallback> = [];
  window.requestAnimationFrame = cb => {
    console.log("scheduling work");
    animationFrameCallbacks.push(cb);
    return 1;
  };
  let count = 0;
  let calls: Array<string> = [];
  let sendBeacon = (path, data) => {
    console.log("Here?!?!?!");
    calls.push(data);
    count++;
    return count < 2;
  };
  let originalSendBeacon = navigator.sendBeacon;
  navigator.sendBeacon = sendBeacon;
  let bb = new BetterBeacon();
  bb.send("/test", "A");
  bb.send("/test", "B");
  bb.send("/test", "C");
  bb.send("/test", "D");
  expect(calls.length).toBe(4);
  expect(calls).toMatchObject(["A", "B", "B", "B"]);
  expect(animationFrameCallbacks.length).toBe(3);
  count = 0;
  calls = [];
  animationFrameCallbacks[0](0);
  expect(calls.length).toBe(3);
  expect(calls).toMatchObject(["B", "C", "D"]);
  navigator.sendBeacon = originalSendBeacon;
  window.requestAnimationFrame = originalRequestAnimationFrame;
});
