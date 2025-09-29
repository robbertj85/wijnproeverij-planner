# UI Components

Base UI components built with Radix UI primitives and styled with Tailwind CSS.

## Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui/button';

// Default button
<Button>Click me</Button>

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// As child (renders as a different element)
<Button asChild>
  <a href="/path">Link Button</a>
</Button>
```

## Card

Container component for grouped content.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Dialog

Modal dialog component for overlays and confirmations.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description or instructions
      </DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

## Toast

Notification component for temporary messages.

```tsx
import { useToast } from '@/components/ui/use-toast';

function MyComponent() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: 'Success',
          description: 'Your action was completed successfully',
        });
      }}
    >
      Show Toast
    </Button>
  );
}
```

## Styling

All components use CSS variables for theming. Theme colors can be customized in `app/globals.css`:

- Primary: Wine red (`--primary`)
- Secondary: Warm beige (`--secondary`)
- Accent: Golden amber (`--accent`)
- Background: Light cream (`--background`)

## Accessibility

All components are built on Radix UI primitives and follow WAI-ARIA guidelines for accessibility.