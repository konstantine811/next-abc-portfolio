export class CharacterControlsDebug {
  private _config = {};
  constructor(
    maxVelLimit: number,
    turnVelMultiplier: number,
    turnSpeed: number,
    sprintMult: number,
    jumpVel: number,
    jumpForceToGroundMult: number,
    slopJumpMult: number,
    sprintJumpMult: number,
    airDragMultiplier: number,
    dragDampingC: number,
    accDeltaTime: number,
    rejectVelMult: number,
    moveImpulsePointY: number,
    camFollowMult: number
  ) {
    this._config = {
      maxVelLimit: {
        value: maxVelLimit,
        min: 0,
        max: 10,
        step: 0.01,
      },
      turnVelMultiplier: {
        value: turnVelMultiplier,
        min: 0,
        max: 1,
        step: 0.01,
      },
      turnSpeed: {
        value: turnSpeed,
        min: 5,
        max: 30,
        step: 0.01,
      },
      sprintMult: {
        value: sprintMult,
        min: 1,
        max: 5,
        step: 0.01,
      },
      jumpVel: {
        value: jumpVel,
        min: 0,
        max: 10,
        step: 0.01,
      },
      jumpForceToGroundMult: {
        value: jumpForceToGroundMult,
        min: 0,
        max: 80,
        step: 0.1,
      },
      slopJumpMult: {
        value: slopJumpMult,
        min: 0,
        max: 3,
        step: 0.01,
      },
      sprintJumpMult: {
        value: sprintJumpMult,
        min: 1,
        max: 3,
        step: 0.01,
      },
      dragDampingC: {
        value: dragDampingC,
        min: 0,
        max: 0.5,
        step: 0.01,
      },
      airDragMultiplier: {
        value: airDragMultiplier,
        min: 0,
        max: 1,
        step: 0.01,
      },
      accDeltaTime: {
        value: accDeltaTime,
        min: 0,
        max: 50,
        step: 1,
      },
      rejectVelMult: {
        value: rejectVelMult,
        min: 0,
        max: 10,
        step: 0.01,
      },
      moveImpulsePointY: {
        value: moveImpulsePointY,
        min: 0,
        max: 3,
        step: 0.1,
      },
      camFollowMult: {
        value: camFollowMult,
        min: 0,
        max: 15,
        step: 0.1,
      },
    };
  }

  get config() {
    return this._config;
  }
}

export class FloatingRayDebug {
  private _config = {};
  constructor(
    capsuleHalfHeight: number,
    capsuleRadius: number,
    floatHeight: number,
    rayHitForgiveness: number,
    springK: number,
    dampingC: number
  ) {
    this._config = {
      rayOriginOffset: {
        x: 0,
        y: -capsuleHalfHeight,
        z: 0,
      },
      rayHitForgiveness: {
        value: rayHitForgiveness,
        min: 0,
        max: 0.5,
        step: 0.01,
      },
      rayLength: {
        value: capsuleRadius + 2,
        min: 0,
        max: capsuleRadius + 10,
        step: 0.01,
      },
      rayDir: {
        x: 0,
        y: -1,
        z: 0,
      },
      floatDis: {
        value: capsuleRadius + floatHeight,
        min: 0,
        max: capsuleRadius + 2,
        step: 0.01,
      },
      springK: {
        value: springK,
        min: 0,
        max: 5,
        step: 0.01,
      },
      dampingC: {
        value: dampingC,
        min: 0,
        max: 3,
        step: 0.01,
      },
    };
  }

  get config() {
    return this._config;
  }
}

export class SlopeRayDebug {
  private _config = {};
  constructor(
    slopeMaxAngle: number,
    capsuleRadius: number,
    slopeUpExtraForce: number,
    slopeDownExtraForce: number
  ) {
    this._config = {
      showSlopeRayOrigin: false,
      slopeMaxAngle: {
        value: slopeMaxAngle,
        min: 0,
        max: 1.57,
        step: 0.01,
      },
      slopeRayOriginOffset: {
        value: capsuleRadius,
        min: 0,
        max: capsuleRadius + 3,
        step: 0.01,
      },
      slopeRayLength: {
        value: capsuleRadius + 3,
        min: 0,
        max: capsuleRadius + 13,
        step: 0.01,
      },
      slopeRayDir: {
        x: 0,
        y: -1,
        z: 0,
      },
      slopeUpExtraForce: {
        value: slopeUpExtraForce,
        min: 0,
        max: 5,
        step: 0.01,
      },
      slopeDownExtraForce: {
        value: slopeDownExtraForce,
        min: 0,
        max: 5,
        step: 0.01,
      },
    };
  }

  get config() {
    return this._config;
  }
}

export class AutoBalanceForceDebug {
  private _config = {};
  constructor(
    autoBalanceSpringK: number,
    autoBalanceDampingC: number,
    autoBalanceSpringOnY: number,
    autoBalanceDampingOnY: number
  ) {
    this._config = {
      autoBalance: {
        value: true,
      },
      autoBalanceSpringK: {
        value: autoBalanceSpringK,
        min: 0,
        max: 5,
        step: 0.01,
      },
      autoBalanceDampingC: {
        value: autoBalanceDampingC,
        min: 0,
        max: 0.1,
        step: 0.001,
      },
      autoBalanceSpringOnY: {
        value: autoBalanceSpringOnY,
        min: 0,
        max: 5,
        step: 0.01,
      },
      autoBalanceDampingOnY: {
        value: autoBalanceDampingOnY,
        min: 0,
        max: 0.1,
        step: 0.001,
      },
    };
  }

  get config() {
    return this._config;
  }
}
