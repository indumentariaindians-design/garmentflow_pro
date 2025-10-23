import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const StageInstructions = ({ currentStage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stageInstructions = {
    'Design': {
      title: 'Design Stage Instructions',
      icon: 'Palette',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      instructions: [
        'Review customer specifications and design requirements',
        'Create or modify design templates using approved software',
        'Ensure design meets brand guidelines and quality standards',
        'Generate print-ready files in required formats',
        'Verify color accuracy and design placement'
      ],
      qualityChecks: [
        'Design resolution meets minimum 300 DPI requirement',
        'Colors are within approved pantone range',
        'Text is legible and properly positioned',
        'Design fits within garment print area',
        'File format is compatible with printing equipment'
      ],
      tools: ['Adobe Illustrator', 'Photoshop', 'Color Calibration Tools'],
      estimatedTime: '15-30 minutes per design'
    },
    'Impresión': {
      title: 'Printing Stage Instructions',
      icon: 'Printer',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      instructions: [
        'Load approved design files into printing system',
        'Calibrate printer settings for material type',
        'Perform test print to verify quality',
        'Execute full print run according to quantity requirements',
        'Inspect each printed piece for defects'
      ],
      qualityChecks: [
        'Print alignment is accurate within 2mm tolerance',
        'Color saturation matches approved sample',
        'No smudging or ink bleeding present',
        'Print coverage is complete and uniform',
        'Material handling shows no damage'
      ],
      tools: ['Digital Printer', 'Color Matching System', 'Quality Loupe'],
      estimatedTime: '5-10 minutes per piece'
    },
    'Planchado': {
      title: 'Pressing Stage Instructions',
      icon: 'Zap',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      instructions: [
        'Preheat pressing equipment to specified temperature',
        'Position printed material correctly on press bed',
        'Apply appropriate pressure and timing settings',
        'Allow proper cooling time before handling',
        'Inspect adhesion quality and finish'
      ],
      qualityChecks: [
        'Print adhesion is secure with no lifting edges',
        'No heat damage or discoloration visible',
        'Surface finish is smooth and professional',
        'Temperature settings match material requirements',
        'Cooling process completed fully'
      ],
      tools: ['Heat Press', 'Temperature Gun', 'Pressure Gauge'],
      estimatedTime: '3-5 minutes per piece'
    },
    'Corte': {
      title: 'Cutting Stage Instructions',
      icon: 'Scissors',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      instructions: [
        'Review cutting patterns and size specifications',
        'Prepare cutting tools and ensure sharpness',
        'Lay out materials efficiently to minimize waste',
        'Execute cuts following marked guidelines precisely',
        'Sort cut pieces by size and prepare for next stage'
      ],
      qualityChecks: [
        'Cut edges are clean and straight',
        'Dimensions match pattern specifications exactly',
        'No fraying or damage to material edges',
        'All required pieces are present and accounted',
        'Sorting and labeling is accurate'
      ],
      tools: ['Fabric Scissors', 'Rotary Cutter', 'Cutting Mat', 'Rulers'],
      estimatedTime: '8-12 minutes per garment'
    },
    'Estampado': {
      title: 'Stamping Stage Instructions',
      icon: 'Stamp',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      instructions: [
        'Prepare stamping equipment and verify design alignment',
        'Load appropriate stamping materials and inks',
        'Position garment pieces accurately on stamping bed',
        'Execute stamping process with consistent pressure',
        'Inspect stamped results for quality and completeness'
      ],
      qualityChecks: [
        'Stamp impression is clear and complete',
        'Alignment matches design specifications',
        'Ink coverage is uniform without gaps',
        'No smudging or double impressions present',
        'Stamped area is properly cured'
      ],
      tools: ['Stamping Press', 'Alignment Guides', 'Specialty Inks'],
      estimatedTime: '4-8 minutes per piece'
    },
    'Confección': {
      title: 'Sewing Stage Instructions',
      icon: 'Shirt',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      instructions: [
        'Organize cut pieces according to assembly sequence',
        'Set up sewing machine with appropriate thread and settings',
        'Follow construction sequence as per garment specifications',
        'Maintain consistent seam allowances and stitch quality',
        'Press seams and finish edges as required'
      ],
      qualityChecks: [
        'Seam strength meets durability requirements',
        'Stitch tension is consistent throughout',
        'No puckering or gathering in seams',
        'Thread color matches or complements garment',
        'All construction details are properly executed'
      ],
      tools: ['Sewing Machine', 'Overlock Machine', 'Iron', 'Measuring Tools'],
      estimatedTime: '20-35 minutes per garment'
    },
    'QC': {
      title: 'Quality Control Instructions',
      icon: 'CheckCircle',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      instructions: [
        'Inspect garment thoroughly for construction defects',
        'Verify all design elements are properly applied',
        'Check sizing and fit against specifications',
        'Test functionality of closures and hardware',
        'Document any issues and determine pass/fail status'
      ],
      qualityChecks: [
        'No visible construction defects or flaws',
        'Design placement and quality meets standards',
        'Sizing matches order specifications',
        'All functional elements work properly',
        'Overall appearance meets brand standards'
      ],
      tools: ['Inspection Checklist', 'Measuring Tools', 'Light Box'],
      estimatedTime: '5-8 minutes per garment'
    },
    'Empaquetado': {
      title: 'Packaging Stage Instructions',
      icon: 'Package',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      instructions: [
        'Prepare packaging materials and labels',
        'Fold garments according to brand standards',
        'Insert care labels and promotional materials',
        'Seal packages securely with appropriate methods',
        'Apply shipping labels and prepare for dispatch'
      ],
      qualityChecks: [
        'Garments are folded neatly without wrinkles',
        'All required materials are included',
        'Packaging is secure and professional',
        'Labels are accurate and properly applied',
        'Package meets shipping requirements'
      ],
      tools: ['Folding Boards', 'Packaging Materials', 'Label Printer'],
      estimatedTime: '3-5 minutes per garment'
    }
  };

  const currentInstructions = stageInstructions?.[currentStage] || stageInstructions?.['Design'];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name={currentInstructions?.icon} size={20} className={currentInstructions?.color} />
          <h2 className="text-lg font-semibold text-foreground">{currentInstructions?.title}</h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {/* Quick Reference */}
      <div className={`${currentInstructions?.bgColor} ${currentInstructions?.borderColor} border rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-foreground">Quick Reference</h3>
          <span className="text-sm text-muted-foreground flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{currentInstructions?.estimatedTime}</span>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Key Steps:</p>
            <ul className="space-y-1">
              {currentInstructions?.instructions?.slice(0, 3)?.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-medium">{index + 1}.</span>
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1">Required Tools:</p>
            <div className="flex flex-wrap gap-1">
              {currentInstructions?.tools?.map((tool, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-background rounded text-xs text-foreground border border-border"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Detailed Instructions */}
      {isExpanded && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="List" size={16} />
              <span>Detailed Instructions</span>
            </h3>
            <ol className="space-y-2">
              {currentInstructions?.instructions?.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-foreground">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Quality Checkpoints</span>
            </h3>
            <ul className="space-y-2">
              {currentInstructions?.qualityChecks?.map((check, index) => (
                <li key={index} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50">
                  <Icon name="CheckCircle" size={16} className="text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{check}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageInstructions;