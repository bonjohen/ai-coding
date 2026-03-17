/**
 * Pure SVG radar chart renderer for 7-axis dimension scores.
 */

interface RadarAxis {
  label: string;
  shortLabel: string;
  score: number; // 1-4 scale
}

export function renderRadarChart(
  axes: RadarAxis[],
  container: HTMLElement,
  size: number = 320
): void {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const labelRadius = size * 0.47;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // Start from top

  // Grid levels (1-4)
  const gridLevels = [1, 2, 3, 4];
  const gridColor = 'rgba(255,255,255,0.08)';
  const axisColor = 'rgba(255,255,255,0.12)';
  const scoreColor = '#6dacf0';
  const scoreFill = 'rgba(109,172,240,0.2)';

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Competence radar chart showing scores across ${n} dimensions">`;

  // Draw grid polygons
  for (const level of gridLevels) {
    const r = (level / 4) * maxRadius;
    const points = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    svg += `<polygon points="${points.join(' ')}" fill="none" stroke="${gridColor}" stroke-width="1"/>`;
  }

  // Draw axis lines
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const x = cx + maxRadius * Math.cos(angle);
    const y = cy + maxRadius * Math.sin(angle);
    svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${axisColor}" stroke-width="1"/>`;
  }

  // Draw score polygon
  const scorePoints = [];
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = (axes[i].score / 4) * maxRadius;
    scorePoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  svg += `<polygon points="${scorePoints.join(' ')}" fill="${scoreFill}" stroke="${scoreColor}" stroke-width="2"/>`;

  // Draw score dots
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = (axes[i].score / 4) * maxRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    svg += `<circle cx="${x}" cy="${y}" r="4" fill="${scoreColor}"/>`;
  }

  // Draw labels
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const x = cx + labelRadius * Math.cos(angle);
    const y = cy + labelRadius * Math.sin(angle);

    let anchor = 'middle';
    if (Math.cos(angle) < -0.1) anchor = 'end';
    else if (Math.cos(angle) > 0.1) anchor = 'start';

    const dy = Math.sin(angle) > 0.1 ? '1em' : Math.sin(angle) < -0.1 ? '-0.3em' : '0.35em';

    svg += `<text x="${x}" y="${y}" text-anchor="${anchor}" dy="${dy}" fill="#8891a5" font-size="11" font-family="'DM Sans',sans-serif">${axes[i].shortLabel}</text>`;
  }

  // Center score label
  const avgScore = axes.reduce((sum, a) => sum + a.score, 0) / n;
  svg += `<text x="${cx}" y="${cx - 8}" text-anchor="middle" fill="#e4e6ed" font-size="24" font-weight="600" font-family="'DM Sans',sans-serif">${avgScore.toFixed(1)}</text>`;
  svg += `<text x="${cx}" y="${cx + 12}" text-anchor="middle" fill="#8891a5" font-size="11" font-family="'DM Sans',sans-serif">avg score</text>`;

  svg += '</svg>';
  container.innerHTML = svg;
}
