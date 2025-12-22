import { jsPDF } from 'jspdf';
import { Bird, Breeder } from '@/types';
import { MOCK_BIRDS } from '@/data/mock';

const getBirdObj = (id?: string) => MOCK_BIRDS.find(b => b.id === id);

const getBirdName = (id?: string) => {
  if (!id) return 'NÃO INFORMADO';
  const found = getBirdObj(id);
  return found ? found.name.toUpperCase() : 'REGISTRO EXTERNO';
};

const getBirdRing = (id?: string) => {
  if (!id) return '-';
  const found = getBirdObj(id);
  return found ? found.ringNumber : '-';
};

export const generatePedigreePDF = (bird: Bird, breeder: Breeder) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 15;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  const pageCenter = pageWidth / 2;

  // --- HELPERS DE ESTILO ---
  const setFontTitle = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
  };

  const setFontLabel = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
  };

  const setFontValue = (size = 10) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.setTextColor(0, 0, 0);
  };

  const setFontNormal = (size = 9) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(0, 0, 0);
  };

  // --- 1. TOPO DA PÁGINA (FAIXA SUPERIOR) ---
  // Logo (Esquerda)
  doc.setFillColor(40, 40, 40);
  doc.circle(margin + 10, 20, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.text('LOGO', margin + 10, 21, { align: 'center' });

  // Identificação do Documento (Direita)
  doc.setTextColor(0, 0, 0);
  setFontLabel();
  doc.text('DOCUMENTO DE REGISTRO', pageWidth - margin, 15, { align: 'right' });
  
  setFontValue(12);
  doc.text(`Nº ${bird.id.padStart(6, '0')}`, pageWidth - margin, 20, { align: 'right' });
  
  setFontLabel();
  doc.text(`EMISSÃO: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, 25, { align: 'right' });

  // Linha divisória do cabeçalho
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 32, pageWidth - margin, 32);

  let y = 40;

  // --- 2. DADOS PRINCIPAIS DO ANIMAL (LINHA HORIZONTAL) ---
  // Fundo cinza suave
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y - 4, contentWidth, 14, 'F');

  // Coluna 1: ID
  setFontLabel();
  doc.text('CÓDIGO INTERNO', margin + 5, y);
  setFontValue(11);
  doc.text(bird.id, margin + 5, y + 6);

  // Coluna 2: Sexo
  setFontLabel();
  doc.text('SEXO', pageCenter - 20, y);
  setFontValue(11);
  doc.text(bird.gender, pageCenter - 20, y + 6);

  // Coluna 3: Nascimento
  setFontLabel();
  doc.text('DATA DE NASCIMENTO', pageWidth - margin - 35, y);
  setFontValue(11);
  doc.text(new Date(bird.birthDate).toLocaleDateString('pt-BR'), pageWidth - margin - 35, y + 6);

  y += 20;

  // --- 3. REGISTRO LEGAL (BLOCO ESQUERDA) ---
  const leftBlockX = margin;
  
  setFontLabel();
  doc.text('REGISTRO OFICIAL', leftBlockX, y);
  y += 5;
  
  setFontValue(10);
  doc.text('SISPASS / IBAMA', leftBlockX, y);
  y += 5;
  
  setFontNormal(9);
  doc.text(`CRIADOR: ${breeder.registryNumber}`, leftBlockX, y);
  y += 5;
  doc.text(`UF: ${breeder.city.split('-').pop()?.trim() || 'BR'}`, leftBlockX, y);

  // --- 4. IDENTIFICAÇÃO INDIVIDUAL (CENTRO DESTAQUE) ---
  // Reset Y para alinhar com o bloco legal, mas centralizado
  y -= 15; 
  
  setFontLabel();
  doc.text('NOME DO ANIMAL', pageCenter, y, { align: 'center' });
  y += 7;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text(bird.name.toUpperCase(), pageCenter, y, { align: 'center' });
  y += 7;

  setFontNormal(10);
  doc.text(`${bird.species} - ${bird.mutation}`, pageCenter, y, { align: 'center' });
  y += 6;

  // Anilha com destaque visual (borda arredondada simulada)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageCenter - 25, y - 4, 50, 7, 2, 2, 'S');
  setFontValue(10);
  doc.text(bird.ringNumber, pageCenter, y + 1, { align: 'center' });

  y += 20;

  // --- 5. ÁRVORE GENEALÓGICA (GRADE) ---
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y); // Linha separadora forte
  y += 6;

  setFontLabel();
  doc.text('PEDIGREE / GENEALOGIA', pageCenter, y, { align: 'center' });
  y += 10;

  // Configuração das Colunas
  const colWidth = contentWidth / 4;
  const col1X = margin + (colWidth * 0.5); // Pais
  const col2X = margin + (colWidth * 1.5); // Avós
  const col3X = margin + (colWidth * 2.5); // Bisavós
  const col4X = margin + (colWidth * 3.5); // Tetravós (se houver, usaremos para layout)

  // Layout em 2 grandes grupos: Paterno (Esquerda) e Materno (Direita)
  // Mas a especificação pede: Centro=Animal, Acima=Pais, Externo=Avós.
  // Vamos adaptar para o formato "Vertical Standard" de pedigree:
  // Pai (Topo), Mãe (Baixo) OU Esquerda/Direita.
  // O prompt pede "Simetria visual... Colunas externas".
  // Vamos fazer: Esquerda (Linha Paterna) | Direita (Linha Materna)

  const midLineX = pageCenter;
  const quarterLeft = margin + (contentWidth / 4);
  const quarterRight = pageWidth - margin - (contentWidth / 4);

  // === LADO PATERNO (ESQUERDA) ===
  let currentY = y;
  
  // Título
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, currentY, (contentWidth / 2) - 2, 6, 'F');
  setFontLabel();
  doc.text('LINHAGEM PATERNA', quarterLeft, currentY + 4, { align: 'center' });
  currentY += 12;

  // PAI
  setFontLabel();
  doc.text('PAI', quarterLeft, currentY, { align: 'center' });
  setFontValue(12);
  doc.text(getBirdName(bird.fatherId), quarterLeft, currentY + 5, { align: 'center' });
  setFontNormal(8);
  doc.text(getBirdRing(bird.fatherId), quarterLeft, currentY + 9, { align: 'center' });

  // AVÓS PATERNOS (Abaixo do Pai, divididos)
  currentY += 20;
  const subColLeft1 = margin + (contentWidth / 8);
  const subColLeft2 = pageCenter - (contentWidth / 8);

  setFontLabel();
  doc.text('AVÔ PATERNO', subColLeft1, currentY, { align: 'center' });
  doc.text('AVÓ PATERNA', subColLeft2, currentY, { align: 'center' });

  const father = getBirdObj(bird.fatherId);
  
  setFontValue(9);
  doc.text(getBirdName(father?.fatherId), subColLeft1, currentY + 5, { align: 'center' }); // Avô
  doc.text(getBirdName(father?.motherId), subColLeft2, currentY + 5, { align: 'center' }); // Avó

  // BISAVÓS PATERNOS (Lista abaixo)
  currentY += 15;
  const patGrandFather = getBirdObj(father?.fatherId);
  const patGrandMother = getBirdObj(father?.motherId);

  // Helper corrigido: Parâmetros obrigatórios (x, y) PRIMEIRO
  const drawGreatGrandList = (xPos: number, yPos: number, label: string, id1?: string, id2?: string) => {
    setFontLabel();
    doc.text(label, xPos, yPos, { align: 'center' });
    setFontNormal(7);
    doc.text(`1. ${getBirdName(id1)}`, xPos, yPos + 4, { align: 'center' });
    doc.text(`2. ${getBirdName(id2)}`, xPos, yPos + 8, { align: 'center' });
  };

  drawGreatGrandList(subColLeft1, currentY, 'BISAVÓS (P)', patGrandFather?.fatherId, patGrandFather?.motherId);
  drawGreatGrandList(subColLeft2, currentY, 'BISAVÓS (M)', patGrandMother?.fatherId, patGrandMother?.motherId);


  // === LADO MATERNO (DIREITA) ===
  currentY = y; // Reset Y

  // Título
  doc.setFillColor(240, 240, 240);
  doc.rect(midLineX + 2, currentY, (contentWidth / 2) - 2, 6, 'F');
  setFontLabel();
  doc.text('LINHAGEM MATERNA', quarterRight, currentY + 4, { align: 'center' });
  currentY += 12;

  // MÃE
  setFontLabel();
  doc.text('MÃE', quarterRight, currentY, { align: 'center' });
  setFontValue(12);
  doc.text(getBirdName(bird.motherId), quarterRight, currentY + 5, { align: 'center' });
  setFontNormal(8);
  doc.text(getBirdRing(bird.motherId), quarterRight, currentY + 9, { align: 'center' });

  // AVÓS MATERNOS
  currentY += 20;
  const subColRight1 = midLineX + (contentWidth / 8);
  const subColRight2 = pageWidth - margin - (contentWidth / 8);

  setFontLabel();
  doc.text('AVÔ MATERNO', subColRight1, currentY, { align: 'center' });
  doc.text('AVÓ MATERNA', subColRight2, currentY, { align: 'center' });

  const mother = getBirdObj(bird.motherId);

  setFontValue(9);
  doc.text(getBirdName(mother?.fatherId), subColRight1, currentY + 5, { align: 'center' });
  doc.text(getBirdName(mother?.motherId), subColRight2, currentY + 5, { align: 'center' });

  // BISAVÓS MATERNOS
  currentY += 15;
  const matGrandFather = getBirdObj(mother?.fatherId);
  const matGrandMother = getBirdObj(mother?.motherId);

  drawGreatGrandList(subColRight1, currentY, 'BISAVÓS (P)', matGrandFather?.fatherId, matGrandFather?.motherId);
  drawGreatGrandList(subColRight2, currentY, 'BISAVÓS (M)', matGrandMother?.fatherId, matGrandMother?.motherId);

  // --- RODAPÉ ---
  const pageHeight = 297;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
  
  setFontLabel();
  doc.text(`GERENCIADOR DE PLANTEL - ${breeder.name.toUpperCase()}`, margin, pageHeight - 12);
  doc.text('1', pageWidth - margin, pageHeight - 12, { align: 'right' });

  // Salvar
  doc.save(`Ficha_${bird.name}_${bird.ringNumber}.pdf`);
};