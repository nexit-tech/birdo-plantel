import { jsPDF } from 'jspdf';
import { Bird, Breeder } from '@/types';

export const generatePedigreePDF = (bird: Bird, breeder: Breeder, bgColor: string, allBirds: Bird[]) => {
  
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

  doc.setFillColor(bgColor);
  doc.rect(margin, startY, cardW, cardH, 'F');
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, startY, cardW, cardH);

  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.15 }));
  doc.setFillColor(0, 0, 0);
  doc.circle(rightX + (rightW / 2), startY + (cardH / 2), 30, 'F');
  doc.restoreGraphicsState();

  const lx = margin + 2;
  const ly = contentStartY;

  const drawWhiteBox = (x: number, y: number, w: number, h: number, radius: number = 1) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, w, h, radius, radius, 'FD');
  };

  const headerH = 22;
  drawWhiteBox(lx, ly, leftW, headerH, 2);

  doc.setFillColor(30, 30, 30);
  doc.circle(lx + 11, ly + 11, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.text('BIRDO', lx + 11, ly + 12, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(7);
  doc.text('CRIATÓRIO', lx + 24, ly + 6);
  doc.setFontSize(10);
  doc.text(breeder.name ? breeder.name.toUpperCase() : 'CRIATÓRIO', lx + 24, ly + 11);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(`CTF: ${breeder.registryNumber || '-'} | ${breeder.city || '-'}`, lx + 24, ly + 16);

  const mainDataY = ly + headerH + 2;
  const mainDataH = 35;
  drawWhiteBox(lx, mainDataY, leftW, mainDataH, 2);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 120, 60); 
  doc.text(bird.name.toUpperCase(), lx + (leftW / 2), mainDataY + 7, { align: 'center' });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);
  doc.line(lx + 5, mainDataY + 9, lx + leftW - 5, mainDataY + 9);

  const drawInfoRow = (label: string, value: string, y: number) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(label, lx + 5, y);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
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
    drawWhiteBox(lx, y, leftW, parentBoxH, 1);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(lx + 0.2, y + 0.2, 14, parentBoxH - 0.4, 'F');
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(role, lx + 7, y + 7, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(name, lx + 18, y + 5);
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Anilha: ${ring}`, lx + 18, y + 9);
  };

  drawParent('PAI', getBirdName(bird.fatherId), getBirdRing(bird.fatherId), parentsY);
  drawParent('MÃE', getBirdName(bird.motherId), getBirdRing(bird.motherId), parentsY + parentBoxH + 2);

  const footerTextY = parentsY + (parentBoxH * 2) + 8;
  doc.setFontSize(6);
  doc.setTextColor(80, 80, 80);
  doc.text('Documento gerado digitalmente pelo sistema Birdo.', lx + (leftW/2), footerTextY, { align: 'center' });


  const ry = contentStartY;
  const rw = rightW;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('ÁRVORE GENEALÓGICA', rightX + (rw/2), ry + 3, { align: 'center' });

  const treeStartY = ry + 6;
  const gen2W = 38; 
  const gen3W = 42; 
  const genGap = (rw - gen2W - gen3W) / 2;
  const gen2X = rightX + 2;
  const gen3X = rightX + gen2W + 8; 

  const boxH = 9;
  const boxGap = 2;
  
  const totalTreeH = (boxH * 8) + (boxGap * 7); 
  const startTreeY = treeStartY + 2;

  const father = getBirdObj(bird.fatherId);
  const mother = getBirdObj(bird.motherId);
  
  const patGrandFather = getBirdObj(father?.fatherId);
  const patGrandMother = getBirdObj(father?.motherId);
  const matGrandFather = getBirdObj(mother?.fatherId);
  const matGrandMother = getBirdObj(mother?.motherId);

  const drawGenBox = (name: string, ring: string, x: number, y: number, w: number) => {
    drawWhiteBox(x, y, w, boxH, 0.5);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(name.substring(0, 18), x + 2, y + 3.5);
    
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(ring, x + 2, y + 7);
  };

  const drawConnector = (x1: number, y1: number, x2: number, y2: number) => {
    doc.setDrawColor(100, 100, 100);
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
  doc.setTextColor(80, 80, 80);
  doc.text('PATERNOS', rightX + 2, startTreeY - 1.5);
  doc.text('BISAVÓS', gen3X, startTreeY - 1.5);

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

  doc.save(`Ficha_${bird.name}.pdf`);
};