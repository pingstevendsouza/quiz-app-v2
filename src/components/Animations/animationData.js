// Simple test animations for debugging
export const loadingAnimation = {
  v: "5.7.11",
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Loading",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.37, 0.45, 0.89, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 },
              lc: 2,
              lj: 1
            }
          ],
          nm: "Circle"
        }
      ]
    }
  ]
};

export const timerAnimation = {
  v: "5.7.11",
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Timer",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Timer",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.89, 0.37, 0.37, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 },
              lc: 2,
              lj: 1
            }
          ],
          nm: "Circle"
        }
      ]
    }
  ]
};

export const quizAnimation = {
  v: "5.7.11",
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Quiz",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Brain",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0] },
            { t: 120, s: [360] }
          ]
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [60, 60] },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 10 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.37, 0.45, 0.89, 1] },
              o: { a: 0, k: 100 }
            }
          ],
          nm: "Brain"
        }
      ]
    }
  ]
};

export const successAnimation = {
  v: "5.7.11",
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Success",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Check",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 40 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.37, 0.89, 0.45, 1] },
              o: { a: 0, k: 100 }
            }
          ],
          nm: "Check"
        }
      ]
    }
  ]
}; 