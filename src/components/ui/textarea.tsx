import * as React from 'react';

import { cn } from './utils';
import { textareaClassName } from './field-styles';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(textareaClassName, className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
