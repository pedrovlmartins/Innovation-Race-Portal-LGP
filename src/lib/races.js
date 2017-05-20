var phases = {
  UNSTARTED: 0,
  THINK_GEEK: 1,
  VALIDATION: 2,
  COACHING: 3,
  KICK_OFF: 4,
  FINISHED: 5,
};

var phaseDescriptions = [
  'Unstarted',
  'Think Geek',
  'Validation',
  'Coaching',
  'Project Kick-Off',
  'Finished',
];

module.exports = {
  phases: phases,

  getPhaseDescription: function (phaseNum)
  {
    if (phaseNum < 0 || phaseNum >= phaseDescriptions.length)
      return null;
    return phaseDescriptions[phaseNum];
  },

  getPhase: function (phase1Start, phase2Start, phase3Start, phase4Start, phase4End) {
    var phase1Start = new Date(phase1Start).getTime();
    var phase2Start = new Date(phase2Start).getTime();
    var phase3Start = new Date(phase3Start).getTime();
    var phase4Start = new Date(phase4Start).getTime();
    var phase4End = new Date(phase4End).getTime();
    var currentDate = new Date().getTime();
    if (currentDate < phase1Start) {
      return phases.UNSTARTED;
    } else if (currentDate < phase2Start) {
      return phases.THINK_GEEK;
    } else if (currentDate < phase3Start) {
      return phases.VALIDATION;
    } else if (currentDate < phase4Start) {
      return phases.COACHING;
    } else if (currentDate < phase4End) {
      return phases.KICK_OFF;
    } else {
      return phases.FINISHED;
    }
  }
};
