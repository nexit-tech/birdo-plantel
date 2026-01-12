import { jsPDF } from 'jspdf';
import { Bird, Breeder } from '@/types';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const generateCompetitionPDF = async (
  bird: Bird, 
  breeder: Breeder, 
  allBirds: Bird[],
  qrCodeDataUrl?: string
) => {
  
  const theme = {
    bg: '#09090b',
    card: '#18181b',
    textMain: '#ffffff',
    textSec: '#94a3b8',
    accent: '#fbbf24',
    line: '#fbbf24',
    boxFill: '#27272a'
  };

  const getBirdObj = (id?: string) => allBirds.find(b => b.id === id);

  const getBirdName = (id?: string) => {
    if (!id) return '********';
    const found = getBirdObj(id);
    return found ? found.name.toUpperCase() : 'EXTERNO';
  };

  const getBirdRing = (id?: string) => {
    if (!id) return '---';
    const found = getBirdObj(id);
    return found ? found.ringNumber : '---';
  };

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let breederLogo: HTMLImageElement | null = null;
  if (breeder.photoUrl) {
    try {
      breederLogo = await loadImage(breeder.photoUrl);
    } catch (error) {
      console.error(error);
    }
  }

  const initial = breeder.name ? breeder.name.charAt(0).toUpperCase() : 'B';

  const pageW = 210;
  const margin = 10;
  const cardW = pageW - (margin * 2);
  const cardH = 100; 
  const startY = 10;
  const contentStartY = startY + 2;

  const colGap = 4;
  const leftW = (cardW * 0.45) - (colGap / 2);
  const rightW = (cardW * 0.55) - (colGap / 2);
  const rightX = margin + leftW + colGap;

  doc.setFillColor(theme.bg);
  doc.rect(margin, startY, cardW, cardH, 'F');
  
  doc.setDrawColor(theme.accent);
  doc.setLineWidth(0.8);
  doc.rect(margin, startY, cardW, cardH);

  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.10 }));
  
  const watermarkCX = rightX + (rightW / 2);
  const watermarkCY = startY + (cardH / 2);

  if (breederLogo) {
    const wSize = 60;
    doc.addImage(breederLogo, 'PNG', watermarkCX - (wSize/2), watermarkCY - (wSize/2), wSize, wSize);
  } else {
    doc.setFillColor(theme.accent);
    doc.circle(watermarkCX, watermarkCY, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text(initial, watermarkCX, watermarkCY + 14, { align: 'center' });
  }
  doc.restoreGraphicsState();

  const lx = margin + 2;
  const ly = contentStartY;

  const drawBox = (x: number, y: number, w: number, h: number, radius: number = 1) => {
    doc.setFillColor(theme.boxFill);
    doc.setDrawColor(theme.accent); 
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, w, h, radius, radius, 'FD');
  };

  const headerH = 22;
  drawBox(lx, ly, leftW, headerH, 2);

  const headerIconCX = lx + 11;
  const headerIconCY = ly + 11;

  if (breederLogo) {
    const hSize = 16;
    doc.addImage(breederLogo, 'PNG', headerIconCX - (hSize/2), headerIconCY - (hSize/2), hSize, hSize);
  } else {
    doc.setFillColor(theme.bg);
    doc.circle(headerIconCX, headerIconCY, 8, 'F');
    doc.setTextColor(theme.accent);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(initial, headerIconCX, headerIconCY + 3.5, { align: 'center' });
  }

  doc.setTextColor(theme.textMain);
  doc.setFontSize(7);
  doc.text('CRIATÓRIO', lx + 24, ly + 6);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.accent);
  doc.text(breeder.name ? breeder.name.toUpperCase() : 'CRIATÓRIO', lx + 24, ly + 11);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(theme.textSec);
  doc.text(`CTF: ${breeder.registryNumber || '-'} | ${breeder.city || '-'}`, lx + 24, ly + 16);

  const mainDataY = ly + headerH + 2;
  const mainDataH = 35;
  drawBox(lx, mainDataY, leftW, mainDataH, 2);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.accent); 
  doc.text(bird.name.toUpperCase(), lx + (leftW / 2), mainDataY + 7, { align: 'center' });

  doc.setDrawColor(theme.accent);
  doc.setLineWidth(0.1);
  doc.line(lx + 5, mainDataY + 9, lx + leftW - 5, mainDataY + 9);

  const drawInfoRow = (label: string, value: string, y: number) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(theme.textSec);
    doc.text(label, lx + 5, y);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(theme.textMain);
    doc.text(value, lx + leftW - 5, y, { align: 'right' });
  };

  let rowY = mainDataY + 15;
  drawInfoRow('ANILHA', bird.ringNumber, rowY);
  rowY += 5;
  drawInfoRow('NASCIMENTO', new Date(bird.birthDate).toLocaleDateString('pt-BR'), rowY);
  rowY += 5;
  drawInfoRow('SEXO', bird.gender, rowY);
  rowY += 5;
  drawInfoRow('ESPÉCIE', bird.species.substring(0, 20), rowY);

  const parentsY = mainDataY + mainDataH + 3;
  const parentBoxH = 12;
  
  const drawParent = (role: string, name: string, ring: string, y: number) => {
    drawBox(lx, y, leftW, parentBoxH, 1);
    
    doc.setFillColor(theme.bg);
    doc.rect(lx + 0.2, y + 0.2, 14, parentBoxH - 0.4, 'F');
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(theme.accent);
    doc.text(role, lx + 7, y + 7, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(theme.textMain);
    doc.text(name, lx + 18, y + 5);
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(theme.textSec);
    doc.text(`Anilha: ${ring}`, lx + 18, y + 9);
  };

  drawParent('PAI', getBirdName(bird.fatherId), getBirdRing(bird.fatherId), parentsY);
  drawParent('MÃE', getBirdName(bird.motherId), getBirdRing(bird.motherId), parentsY + parentBoxH + 2);

  if (qrCodeDataUrl) {
    const qrSize = 22; 
    const qrY = parentsY + (parentBoxH * 2) + 2; 
    const qrX = lx + (leftW / 2) - (qrSize / 2);
    
    try {
      doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      
      doc.setFontSize(5);
      doc.setTextColor(theme.accent);
      doc.text('PERFIL PÚBLICO', lx + (leftW / 2), qrY + qrSize + 2, { align: 'center' });
    } catch (e) {
      console.error(e);
    }
  }

  const ry = contentStartY;
  const rw = rightW;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.textMain);
  doc.text('ÁRVORE GENEALÓGICA', rightX + (rw/2), ry + 3, { align: 'center' });

  const treeStartY = ry + 6;
  const gen2W = 38; 
  const gen3W = 42; 
  const gen2X = rightX + 2;
  const gen3X = rightX + gen2W + 8; 

  const boxH = 9;
  const boxGap = 2;

  const startTreeY = treeStartY + 2;
  
  const drawGenBox = (name: string, ring: string, x: number, y: number, w: number) => {
    drawBox(x, y, w, boxH, 0.5);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(theme.textMain);
    doc.text(name.substring(0, 18), x + 2, y + 3.5);
    
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(theme.textSec);
    doc.text(ring, x + 2, y + 7);
  };

  const drawConnector = (x1: number, y1: number, x2: number, y2: number) => {
    doc.setDrawColor(theme.textSec);
    doc.setLineWidth(0.3);
    doc.line(x1, y1, x1 + 4, y1); 
    doc.line(x1 + 4, y1, x1 + 4, y2); 
    doc.line(x1 + 4, y2, x2, y2);
  };

  let currentY = startTreeY;

  const drawFamilyGroup = (
    gfName: string, gfRing: string, 
    gmName: string, gmRing: string,
    ggf1Name: string, ggf1Ring: string,
    ggm1Name: string, ggm1Ring: string,
    ggf2Name: string, ggf2Ring: string,
    ggm2Name: string, ggm2Ring: string
  ) => {
    const gfY = currentY + (boxH / 2) + (boxGap / 2);
    
    drawGenBox(ggf1Name, ggf1Ring, gen3X, currentY, gen3W);
    drawConnector(gen2X + gen2W, gfY + (boxH/2), gen3X, currentY + (boxH/2));
    currentY += boxH + boxGap;

    drawGenBox(ggm1Name, ggm1Ring, gen3X, currentY, gen3W);
    drawConnector(gen2X + gen2W, gfY + (boxH/2), gen3X, currentY + (boxH/2));
    currentY += boxH + boxGap;

    drawGenBox(gfName, gfRing, gen2X, gfY, gen2W);

    const gmY = currentY + (boxH / 2) + (boxGap / 2);

    drawGenBox(ggf2Name, ggf2Ring, gen3X, currentY, gen3W);
    drawConnector(gen2X + gen2W, gmY + (boxH/2), gen3X, currentY + (boxH/2));
    currentY += boxH + boxGap;

    drawGenBox(ggm2Name, ggm2Ring, gen3X, currentY, gen3W);
    drawConnector(gen2X + gen2W, gmY + (boxH/2), gen3X, currentY + (boxH/2));
    currentY += boxH + boxGap;

    drawGenBox(gmName, gmRing, gen2X, gmY, gen2W);
  };

  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.textSec);
  doc.text('PATERNOS', rightX + 2, startTreeY - 1.5);
  doc.text('BISAVÓS', gen3X, startTreeY - 1.5);

  const father = getBirdObj(bird.fatherId);
  const mother = getBirdObj(bird.motherId);
  
  const patGrandFather = getBirdObj(father?.fatherId);
  const patGrandMother = getBirdObj(father?.motherId);
  const matGrandFather = getBirdObj(mother?.fatherId);
  const matGrandMother = getBirdObj(mother?.motherId);

  drawFamilyGroup(
    getBirdName(father?.fatherId), getBirdRing(father?.fatherId),
    getBirdName(father?.motherId), getBirdRing(father?.motherId),
    getBirdName(patGrandFather?.fatherId), getBirdRing(patGrandFather?.fatherId),
    getBirdName(patGrandFather?.motherId), getBirdRing(patGrandFather?.motherId),
    getBirdName(patGrandMother?.fatherId), getBirdRing(patGrandMother?.fatherId),
    getBirdName(patGrandMother?.motherId), getBirdRing(patGrandMother?.motherId),
  );

  currentY += 2; 
  doc.text('MATERNOS', rightX + 2, currentY - 1.5);

  drawFamilyGroup(
    getBirdName(mother?.fatherId), getBirdRing(mother?.fatherId),
    getBirdName(mother?.motherId), getBirdRing(mother?.motherId),
    getBirdName(matGrandFather?.fatherId), getBirdRing(matGrandFather?.fatherId),
    getBirdName(matGrandFather?.motherId), getBirdRing(matGrandFather?.motherId),
    getBirdName(matGrandMother?.fatherId), getBirdRing(matGrandMother?.fatherId),
    getBirdName(matGrandMother?.motherId), getBirdRing(matGrandMother?.motherId),
  );

  doc.save(`Ficha_COMPETICAO_${bird.name}.pdf`);
};