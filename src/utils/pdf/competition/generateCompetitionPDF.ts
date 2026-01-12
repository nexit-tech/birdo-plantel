import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Bird, Breeder } from '@/types';

interface CompetitionData {
  tournamentName: string;
  association: string;
  date: string;
}

const loadImage = (url: string | undefined | null): Promise<HTMLImageElement | null> => {
  if (!url) return Promise.resolve(null);
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });
};

export const generateCompetitionPDF = async (
  birds: Bird[], 
  allBirds: Bird[],
  breeder: Partial<Breeder> | null,
  data: CompetitionData
) => {
  const getBirdObj = (id?: string) => allBirds.find(b => b.id === id);

  const getBirdName = (id?: string) => {
    if (!id) return '********';
    const found = getBirdObj(id);
    return found ? (found.name || 'SEM NOME').toUpperCase() : 'EXTERNO';
  };

  const getBirdRing = (id?: string) => {
    if (!id) return '---';
    const found = getBirdObj(id);
    return found ? (found.ringNumber || '---') : '---';
  };

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const breederLogo = await loadImage(breeder?.photoUrl);
  const appLogo = await loadImage('/birdo.png');

  const initial = breeder?.name ? breeder.name.charAt(0).toUpperCase() : 'C';

  const pageW = 210;
  const margin = 10;
  const cardW = pageW - (margin * 2);
  const cardH = 100;
  const cardsPerPage = 2;
  
  const colors = {
    black: [28, 28, 30],
    gold: [212, 175, 55],
    white: [255, 255, 255],
    grey: [242, 242, 247],
    textGrey: [142, 142, 147],
    border: [229, 229, 234]
  };

  for (let i = 0; i < birds.length; i++) {
    const bird = birds[i];
    
    if (i > 0 && i % cardsPerPage === 0) doc.addPage();
    const positionOnPage = i % cardsPerPage;
    const startY = margin + (positionOnPage * (cardH + 15));

    const contentStartY = startY + 2;
    const colGap = 4;
    
    const leftW = (cardW * 0.40) - (colGap / 2);
    const rightW = (cardW * 0.60) - (colGap / 2);
    const rightX = margin + leftW + colGap;

    const birdPhoto = await loadImage(bird.photoUrl);

    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, startY, cardW, cardH, 3, 3, 'FD');

    if (birdPhoto) {
      doc.saveGraphicsState();
      
      doc.moveTo(rightX, startY);
      doc.lineTo(rightX + rightW, startY);
      doc.lineTo(rightX + rightW, startY + cardH);
      doc.lineTo(rightX, startY + cardH);
      doc.lineTo(rightX, startY);
      doc.clip();
      
      // @ts-ignore
      doc.setGState(new doc.GState({ opacity: 0.1 }));
      
      const imgSize = Math.min(rightW, cardH) * 0.9;
      const imgX = rightX + (rightW - imgSize) / 2;
      const imgY = startY + (cardH - imgSize) / 2;
      
      try {
        doc.addImage(birdPhoto, 'JPEG', imgX, imgY, imgSize, imgSize);
      } catch (e) {}
      doc.restoreGraphicsState();
    }

    const treeStartY = contentStartY + 8;
    const boxH = 12;
    const gapY = 3;
    const parentW = rightW * 0.4;
    const gpW = rightW * 0.55;
    const gpX = rightX + parentW + (rightW * 0.05);

    const drawBox = (label: string, name: string, ring: string, x: number, y: number, w: number, h: number) => {
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.2);
      doc.roundedRect(x, y, w, h, 1, 1, 'FD');

      doc.setFontSize(5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
      doc.text(String(label).toUpperCase(), x + 2, y + 3);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
      
      let dName = String(name);
      const safeW = w - 4;
      if (doc.getTextWidth(dName) > safeW) {
        while (doc.getTextWidth(dName + '...') > safeW && dName.length > 0) {
          dName = dName.slice(0, -1);
        }
        dName += '...';
      }
      doc.text(dName, x + 2, y + 7);

      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(String(ring), x + 2, y + 10.5);
    };

    const drawConnector = (x1: number, y1: number, x2: number, y2: number) => {
      doc.setDrawColor(colors.gold[0], colors.gold[1], colors.gold[2]);
      doc.setLineWidth(0.2);
      doc.line(x1, y1, x2, y2);
    };

    const father = getBirdObj(bird.fatherId);
    const mother = getBirdObj(bird.motherId);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.text('GENEALOGIA', rightX + (rightW/2), contentStartY + 4, { align: 'center' });

    const patY = treeStartY;
    const fatherY = patY + boxH + (gapY/2); 
    
    drawBox('PAI', getBirdName(bird.fatherId), getBirdRing(bird.fatherId), rightX, fatherY, parentW, boxH);
    drawBox('AVÔ PATERNO', getBirdName(father?.fatherId), getBirdRing(father?.fatherId), gpX, patY, gpW, boxH);
    drawBox('AVÓ PATERNA', getBirdName(father?.motherId), getBirdRing(father?.motherId), gpX, patY + boxH + gapY, gpW, boxH);

    const fOutX = rightX + parentW;
    const fOutY = fatherY + (boxH/2);
    drawConnector(fOutX, fOutY, fOutX + 2, fOutY); 
    drawConnector(fOutX + 2, patY + (boxH/2), fOutX + 2, patY + boxH + gapY + (boxH/2)); 
    drawConnector(fOutX + 2, patY + (boxH/2), gpX, patY + (boxH/2)); 
    drawConnector(fOutX + 2, patY + boxH + gapY + (boxH/2), gpX, patY + boxH + gapY + (boxH/2)); 

    const matY = treeStartY + (boxH * 2) + (gapY * 3);
    const motherY = matY + boxH + (gapY/2);
    
    drawBox('MÃE', getBirdName(bird.motherId), getBirdRing(bird.motherId), rightX, motherY, parentW, boxH);
    drawBox('AVÔ MATERNO', getBirdName(mother?.fatherId), getBirdRing(mother?.fatherId), gpX, matY, gpW, boxH);
    drawBox('AVÓ MATERNA', getBirdName(mother?.motherId), getBirdRing(mother?.motherId), gpX, matY + boxH + gapY, gpW, boxH);

    const mOutX = rightX + parentW;
    const mOutY = motherY + (boxH/2);
    drawConnector(mOutX, mOutY, mOutX + 2, mOutY); 
    drawConnector(mOutX + 2, matY + (boxH/2), mOutX + 2, matY + boxH + gapY + (boxH/2)); 
    drawConnector(mOutX + 2, matY + (boxH/2), gpX, matY + (boxH/2)); 
    drawConnector(mOutX + 2, matY + boxH + gapY + (boxH/2), gpX, matY + boxH + gapY + (boxH/2)); 

    const lx = margin + 3;
    const ly = contentStartY;

    doc.setDrawColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.setFillColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.roundedRect(lx, ly, leftW, 20, 2, 2, 'FD');

    if (breederLogo) {
      try {
        doc.addImage(breederLogo, 'PNG', lx + 2, ly + 2, 16, 16);
      } catch (e) {}
    } else if (appLogo) {
      try {
        doc.addImage(appLogo, 'PNG', lx + 2, ly + 2, 16, 16);
      } catch (e) {}
    } else {
      doc.setFillColor(colors.gold[0], colors.gold[1], colors.gold[2]);
      doc.circle(lx + 10, ly + 10, 8, 'F');
      doc.setFontSize(10);
      doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
      doc.text(initial, lx + 10, ly + 13.5, { align: 'center' });
    }

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    const hName = breeder?.name || data.association || 'CRIADOURO';
    doc.text(String(hName).toUpperCase().substring(0, 22), lx + 20, ly + 8);
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    doc.text(`CTF: ${breeder?.registryNumber || '-'}`, lx + 20, ly + 12);
    doc.text(String(breeder?.city || data.tournamentName).substring(0, 25), lx + 20, ly + 15);

    const infoY = ly + 24;
    
    doc.setFontSize(6);
    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    doc.text('ANILHA', lx, infoY);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.text(String(bird.ringNumber || '---'), lx, infoY + 6);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    doc.text('NOME', lx, infoY + 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
    doc.text(String(bird.name || 'SEM NOME').toUpperCase().substring(0, 20), lx, infoY + 16);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    doc.text('ESPÉCIE / MUTAÇÃO', lx, infoY + 22);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    doc.text(String(bird.species || '').substring(0, 25), lx, infoY + 26);
    doc.text(String(bird.mutation || '-').substring(0, 25), lx, infoY + 30);

    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    doc.text('SEXO:', lx, infoY + 36);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    const sexText = bird.gender === 'MACHO' ? 'MACHO' : bird.gender === 'FEMEA' ? 'FÊMEA' : '?';
    doc.text(sexText, lx + 10, infoY + 36);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    doc.text('NASC:', lx, infoY + 40);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    const birthText = bird.birthDate ? new Date(bird.birthDate).toLocaleDateString('pt-BR') : '-';
    doc.text(birthText, lx + 10, infoY + 40);

    const qrY = infoY + 44;
    const qrSize = 25;
    const qrX = lx + (leftW - qrSize) / 2;

    try {
      const publicUrl = `${window.location.origin}/share/${bird.id}`;
      const qrDataUrl = await QRCode.toDataURL(publicUrl, { width: 300, margin: 0 });
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    } catch (e) {
      console.warn('QR Code generation failed', e);
    }

    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    doc.text('Ficha digital', lx + (leftW/2), qrY + qrSize + 3, { align: 'center' });

    doc.setFontSize(5);
    doc.setTextColor(colors.textGrey[0], colors.textGrey[1], colors.textGrey[2]);
    const footerText = `Birdo ID: ${bird.id.substring(0,8)} • ${data.date}`;
    doc.text(footerText, margin + 5, startY + cardH - 2);
  }

  const safeName = (data.tournamentName || 'competicao').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`Ficha_${safeName}.pdf`);
};