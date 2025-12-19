import type { Meta, StoryObj } from "@storybook/react";

import { HUDQuickActionsComponent } from '../hud-quick-actions.component';

const meta: Meta<typeof HUDQuickActionsComponent> = {
  title: "Table/HUD/Quick Actions",
  component: HUDQuickActionsComponent,
  args: {
    quickActions: [
      [100n, 'Min'],
      [500n, '1/2 Pot'],
      [1000n, 'Pot'],
      [5000n, 'All In'],
    ],
    onChange: (value: bigint) => { 
      console.log('Quick action clicked:', value);
    },
    currentValue: 100n
  },
};

export default meta;

type Story = StoryObj<typeof HUDQuickActionsComponent>;

export const HUDQuickActions: Story = {};
