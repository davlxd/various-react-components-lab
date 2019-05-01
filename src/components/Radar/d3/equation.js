

export const quadratic = (a, b, c) => {
  return [
    (-b - Math.sqrt(b * b  - 4 * a * c)) / (2 * a),
    (-b + Math.sqrt(b * b  - 4 * a * c)) / (2 * a),
   ]
}
