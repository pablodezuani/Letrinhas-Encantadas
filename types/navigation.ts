export type RootStackParamList = {
  Home: { avatarId: number; gender: 'menino' | 'menina' };
  Login: undefined;
  ReadingGame: { gender: 'menino' | 'menina' };
  PhraseBuilder: { gender: 'menino' | 'menina' };
  VowelsGame: { gender: 'menino' | 'menina' };
  WordFormationGame: { gender: 'menino' | 'menina' };
  AddChildScreen: undefined;
  ChoiceScreen: undefined; // Add this line to your param list
};
