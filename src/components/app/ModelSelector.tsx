import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { GEMINI_MODELS } from '@/services/gemini';
import type { GeminiModel } from '@/types';

interface ModelSelectorProps {
  selectedModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: Readonly<ModelSelectorProps>) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">AI Model</Label>
      <div className="grid gap-2">
        {Object.values(GEMINI_MODELS).map((model) => (
          <Card
            key={model.id}
            className={`p-3 cursor-pointer transition-all ${
              selectedModel === model.id
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onModelChange(model.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{model.name}</h4>
                  {selectedModel === model.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {model.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
