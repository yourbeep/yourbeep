import { ImageSourcePropType } from 'react-native';
import {
  Activity,
  Briefcase,
  CircleDot,
  HeartHandshake,
  ShieldAlert,
  Wallet,
} from 'lucide-react-native';

import { appImages } from '@/constants/images';

export interface AwarenessOption {
  accent: string;
  description?: string;
  id: string;
  eyebrow?: string;
  imageSource?: ImageSourcePropType;
  title: string;
  tone: 'cool' | 'mint' | 'peach' | 'rose' | 'sand' | 'warm';
}

export interface AwarenessResultContent {
  detectedState: string;
  energyBody: string;
  energyTitle: string;
  flowBody: string;
  flowTitle: string;
  metricLeftLabel: string;
  metricLeftValue: string;
  metricRightLabel: string;
  metricRightValue: string;
  synthesisBody: string;
  synthesisTitle: string;
}

export const activationOptions: readonly AwarenessOption[] = [
  {
    accent: '#0D7F77',
    id: 'excitement-enthusiasm',
    imageSource: appImages.awarenessExcitement,
    title: 'Excitement & Enthusiasm',
    tone: 'warm',
  },
  {
    accent: '#0D7F77',
    id: 'alert-nervous',
    imageSource: appImages.awarenessAlert,
    title: 'Alert & Nervous',
    tone: 'mint',
  },
  {
    accent: '#0D7F77',
    id: 'irritation-rage',
    imageSource: appImages.awarenessIrritation,
    title: 'Irritation & Rage',
    tone: 'rose',
  },
  {
    accent: '#0D7F77',
    id: 'calm-steady',
    imageSource: appImages.awarenessCalm,
    title: 'Calm & Steady',
    tone: 'cool',
  },
  {
    accent: '#0D7F77',
    id: 'resilient-contesting',
    imageSource: appImages.awarenessResilient,
    title: 'Resilient & Contesting',
    tone: 'sand',
  },
  {
    accent: '#0D7F77',
    id: 'stuck-rigid',
    imageSource: appImages.awarenessStuck,
    title: 'Stuck & Rigid',
    tone: 'peach',
  },
] as const;

export const activationResults: Record<string, AwarenessResultContent> = {
  'alert-nervous': {
    detectedState: 'Alert Nervous',
    energyBody:
      'Heightened neural response and systemic readiness. Your sympathetic nervous system is actively engaged, mobilizing energy reserves for rapid reaction and heightened sensory intake.',
    energyTitle: 'Activation',
    flowBody:
      'Oscillating focus marked by internal tension. Cognitive shifts are rapid, creating friction between sustained attention and environmental scanning.',
    flowTitle: 'Waver',
    metricLeftLabel: 'Sensory Load',
    metricLeftValue: '87%',
    metricRightLabel: 'Vagal Interference',
    metricRightValue: 'High',
    synthesisBody:
      'The intersection of Activation and Waver indicates a high-energy but disorganized somatic state. Your neural pathways are firing rapidly, creating internal kinetic energy that lacks a clear anchoring mechanism.',
    synthesisTitle: 'Friction in the Pathway',
  },
  'calm-steady': {
    detectedState: 'Calm Steady',
    energyBody:
      'Balanced energy distribution and measured engagement. Your body is resourced enough to respond without overshooting its current capacity.',
    energyTitle: 'Regulation',
    flowBody:
      'Stable focus with flexible attention. Sensory input is being processed without excessive environmental scanning or friction.',
    flowTitle: 'Steady',
    metricLeftLabel: 'Cortical Ease',
    metricLeftValue: '79%',
    metricRightLabel: 'Recovery Access',
    metricRightValue: 'Strong',
    synthesisBody:
      'Regulation paired with Steady suggests a grounded internal state. Your body can sustain attention while remaining open to micro-adjustments in the environment.',
    synthesisTitle: 'Anchored Momentum',
  },
  'excitement-enthusiasm': {
    detectedState: 'Excitement Enthusiasm',
    energyBody:
      'Elevated engagement with a strong approach orientation. Energy is available, expansive, and directed toward novelty or desired outcomes.',
    energyTitle: 'Activation',
    flowBody:
      'Momentum is high, but the system may overextend if pacing and breath regulation are ignored.',
    flowTitle: 'Surge',
    metricLeftLabel: 'Forward Drive',
    metricLeftValue: '82%',
    metricRightLabel: 'Load Stability',
    metricRightValue: 'Moderate',
    synthesisBody:
      'Activation with Surge reflects energizing momentum. The system benefits from intentional pacing so excitement does not become agitation.',
    synthesisTitle: 'Constructive Amplification',
  },
  'irritation-rage': {
    detectedState: 'Irritation Rage',
    energyBody:
      'Energy is concentrated around protection and reactivity. The system is mobilized, but the response is sharp and defensive rather than exploratory.',
    energyTitle: 'Defense',
    flowBody:
      'Focus narrows quickly and can harden into fixation. External friction tends to escalate internal threat tracking.',
    flowTitle: 'Friction',
    metricLeftLabel: 'Threat Charge',
    metricLeftValue: '91%',
    metricRightLabel: 'Release Access',
    metricRightValue: 'Low',
    synthesisBody:
      'Defense with Friction signals a braced state with limited spaciousness. Slowing the body is necessary before clearer interpretation becomes possible.',
    synthesisTitle: 'Constricted Drive',
  },
  'resilient-contesting': {
    detectedState: 'Resilient Contesting',
    energyBody:
      'The system is engaged with challenge but still preserving adaptability. There is tension, though it can be directed constructively.',
    energyTitle: 'Persistence',
    flowBody:
      'Attention remains active with intermittent resistance. The body can stay with complexity, but needs recovery windows.',
    flowTitle: 'Tensioned',
    metricLeftLabel: 'Effort Hold',
    metricLeftValue: '76%',
    metricRightLabel: 'Recovery Margin',
    metricRightValue: 'Moderate',
    synthesisBody:
      'Persistence with Tensioned indicates meaningful capacity under load. Recovery cues help prevent this state from slipping into strain.',
    synthesisTitle: 'Endurance Under Pressure',
  },
  'stuck-rigid': {
    detectedState: 'ALERT NERVOUS',
    energyBody:
      'Energy appears locked rather than unavailable. The system is preserving safety through immobility, contraction, or reduced exploratory behavior.',
    energyTitle: 'Constriction',
    flowBody:
      'Focus can feel fixed, flattened, or difficult to redirect. Effort increases, but movement through experience decreases.',
    flowTitle: 'Static',
    metricLeftLabel: 'Freeze Index',
    metricLeftValue: '84%',
    metricRightLabel: 'Adaptability',
    metricRightValue: 'Low',
    synthesisBody:
      'Constriction with Static suggests an internally stalled pathway. Gentle activation and orienting practices can help soften the freeze response.',
    synthesisTitle: 'Held in Place',
  },
};

export const expansionOptions: readonly AwarenessOption[] = [
  {
    accent: '#2F7A67',
    id: 'joy-abundance',
    imageSource: appImages.awarenessExpansionJoy,
    title: 'Joy & abundance',
    tone: 'warm',
  },
  {
    accent: '#2F7A67',
    id: 'surprise-embrace',
    imageSource: appImages.awarenessExpansionSurprise,
    title: 'Surprise & embrace',
    tone: 'mint',
  },
  {
    accent: '#2F7A67',
    id: 'spiralling-enveloped',
    imageSource: appImages.awarenessExpansionSpiral,
    title: 'Spiralling & enveloped',
    tone: 'peach',
  },
  {
    accent: '#2F7A67',
    id: 'compassion-acceptance',
    imageSource: appImages.awarenessExpansionCompassion,
    title: 'Compassion & acceptance',
    tone: 'rose',
  },
  {
    accent: '#2F7A67',
    id: 'protection-resistance',
    imageSource: appImages.awarenessExpansionProtection,
    title: 'Protection & resistance',
    tone: 'sand',
  },
  {
    accent: '#2F7A67',
    id: 'repress-conflicted',
    imageSource: appImages.awarenessExpansionRepress,
    title: 'Repress & conflicted',
    tone: 'cool',
  },
] as const;

export const expansionResults: Record<string, AwarenessResultContent> = {
  'protection-resistance': {
    detectedState: 'Protection Resistance',
    energyBody:
      'Your system is moving toward embodiment, but protective patterning is still active. The body is asking for safety before it allows greater openness.',
    energyTitle: 'Embodiment',
    flowBody:
      'Expansion is present but inconsistent. Protective reflexes create a waver between openness and withdrawal.',
    flowTitle: 'Waver',
    metricLeftLabel: 'Boundary Vigilance',
    metricLeftValue: '81%',
    metricRightLabel: 'Softening Access',
    metricRightValue: 'Emerging',
    synthesisBody:
      'Embodiment paired with Waver reflects a state where growth is possible, but the body continues to test whether it is safe to remain open.',
    synthesisTitle: 'Guarded Expansion',
  },
  'joy-abundance': {
    detectedState: 'Joy Abundance',
    energyBody:
      'Your system is meeting the moment with openness, resourcefulness, and vitality. Energy can move outward without fragmentation.',
    energyTitle: 'Expansion',
    flowBody:
      'Attention broadens with coherence. Increased receptivity is available without compromising clarity.',
    flowTitle: 'Bloom',
    metricLeftLabel: 'Resource Access',
    metricLeftValue: '88%',
    metricRightLabel: 'Flow Ease',
    metricRightValue: 'High',
    synthesisBody:
      'Expansion with Bloom suggests healthy capacity for connection, creativity, and engagement. This state supports meaning-making and action.',
    synthesisTitle: 'Open Channel',
  },
  'surprise-embrace': {
    detectedState: 'Surprise Embrace',
    energyBody:
      'The system is orienting toward novelty with enough support to remain curious. There is activation, but it leans toward welcome rather than alarm.',
    energyTitle: 'Curiosity',
    flowBody:
      'Attention expands in pulses. The body samples new information, then settles before moving further.',
    flowTitle: 'Pulse',
    metricLeftLabel: 'Novelty Reach',
    metricLeftValue: '72%',
    metricRightLabel: 'Grounding',
    metricRightValue: 'Moderate',
    synthesisBody:
      'Curiosity with Pulse reflects healthy expansion that still benefits from grounding rituals to maintain steadiness.',
    synthesisTitle: 'Responsive Openness',
  },
  'spiralling-enveloped': {
    detectedState: 'Spiralling Enveloped',
    energyBody:
      'Expansion is present, but it may be exceeding current containment. The system feels pulled into intensity faster than it can integrate.',
    energyTitle: 'Overflow',
    flowBody:
      'Attention becomes immersive and diffuse. Boundaries soften, but coherence may drop if regulation is not restored.',
    flowTitle: 'Spiral',
    metricLeftLabel: 'Immersion',
    metricLeftValue: '86%',
    metricRightLabel: 'Containment',
    metricRightValue: 'Low',
    synthesisBody:
      'Overflow with Spiral signals an expansive state that needs more structure. Reintroducing boundaries can help preserve insight without collapse.',
    synthesisTitle: 'Too Much Too Fast',
  },
  'compassion-acceptance': {
    detectedState: 'Compassion Acceptance',
    energyBody:
      'Your system is organized around softness, repair, and inclusive awareness. Embodiment is stable enough to allow gentle truth-telling.',
    energyTitle: 'Integration',
    flowBody:
      'Attention is steady and relationally open. Emotional information can be felt without immediate shutdown or escalation.',
    flowTitle: 'Tender',
    metricLeftLabel: 'Repair Access',
    metricLeftValue: '84%',
    metricRightLabel: 'Relational Safety',
    metricRightValue: 'High',
    synthesisBody:
      'Integration with Tender suggests a restorative state. This is a powerful moment for reflection, connection, and grounded action.',
    synthesisTitle: 'Soft Strength',
  },
  'repress-conflicted': {
    detectedState: 'Repress Conflicted',
    energyBody:
      'The system is attempting to hold competing signals at once, often by flattening or suppressing one side of the experience.',
    energyTitle: 'Suppression',
    flowBody:
      'Attention loops between inhibition and activation. Internal conflict reduces the ability to stay with the full shape of the feeling.',
    flowTitle: 'Split',
    metricLeftLabel: 'Conflict Load',
    metricLeftValue: '78%',
    metricRightLabel: 'Embodied Access',
    metricRightValue: 'Limited',
    synthesisBody:
      'Suppression with Split reflects a body that is managing contradiction through control. Supportive pacing is needed before fuller expression can emerge.',
    synthesisTitle: 'Muted Signal',
  },
};

export const valueSystemOptions = [
  { icon: Briefcase, id: 'Work', title: 'Work' },
  { icon: HeartHandshake, id: 'Relationships', title: 'Relationships' },
  { icon: Activity, id: 'Family', title: 'Family' },
  { icon: Wallet, id: 'Finances', title: 'Finances' },
  { icon: CircleDot, id: 'Personal Development', title: 'Personal Dev' },
  { icon: ShieldAlert, id: 'Health', title: 'Health' },
  { icon: Activity, id: 'Previous Stress', title: 'Previous Stress' },
] as const;

export const rootCauseOptions = [
  {
    description: 'A conditioned biological response to past relational dynamics.',
    icon: '◎',
    id: 'learned-emotional-strategy',
    title: 'Learned emotional strategy',
  },
  {
    description: 'External triggers in your immediate surroundings or routine.',
    icon: '◌',
    id: 'recurring-environmental-stressor',
    title: 'Recurring environmental stressor',
  },
  {
    description: 'Cognitive frameworks designed to insulate from perceived threat.',
    icon: '◐',
    id: 'protective-belief-or-meaning',
    title: 'Protective belief or meaning',
  },
  {
    description: 'A fundamental biological or psychological requirement lacking fulfillment.',
    icon: '○',
    id: 'unmet-need',
    title: 'Unmet need',
  },
] as const;

export const summaryCategoryOrder = ['Mental', 'Physical', 'Relational', 'Environmental'] as const;

export const optionToneClasses: Record<AwarenessOption['tone'], string> = {
  cool: 'border-[#C5E6D7] bg-[#E7F8EC]',
  mint: 'border-[#BDE7E4] bg-[#E2F7F4]',
  peach: 'border-[#F2DCC8] bg-[#FBE9D8]',
  rose: 'border-[#F6D8D2] bg-[#FCE7E2]',
  sand: 'border-[#E8D2B6] bg-[#F7E1C7]',
  warm: 'border-[#F1DFCC] bg-[#FFF4E5]',
};
