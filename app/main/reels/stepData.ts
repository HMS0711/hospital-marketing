export interface Step {
  id: string;
  title: string;
  completed: boolean;
}

export function generateInitialSteps(): Step[] {
  return [
    {
      id: 'step1',
      title: '광고주 인사 및 필수작성지 전달',
      completed: false,
    },
  ];
}
