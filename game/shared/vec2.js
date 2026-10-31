// Vector2 helper shared between server and client

export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static add(a, b) { return new Vec2(a.x + b.x, a.y + b.y); }
  static sub(a, b) { return new Vec2(a.x - b.x, a.y - b.y); }
  static mul(v, s) { return new Vec2(v.x * s, v.y * s); }
  static div(v, s) { return new Vec2(v.x / s, v.y / s); }
  static dot(a, b) { return a.x * b.x + a.y * b.y; }
  static dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  static distSq(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return dx*dx + dy*dy; }
  static len(v) { return Math.hypot(v.x, v.y); }
  static normalize(v) { const l = Math.hypot(v.x, v.y); return l === 0 ? new Vec2(0,0) : new Vec2(v.x/l, v.y/l); }
  static rotate(v, angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return new Vec2(v.x * c - v.y * s, v.x * s + v.y * c);
  }
  static lerp(a, b, t) { return new Vec2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t); }
  clone() { return new Vec2(this.x, this.y); }
  toString() { return `(${this.x.toFixed(2)},${this.y.toFixed(2)})`; }
}
