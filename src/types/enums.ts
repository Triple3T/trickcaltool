export enum BoardType {
  AttackBoth = 0,
  // AttackPhysic = 1,
  CriticalMult = 2,
  CriticalMultResist = 3,
  CriticalRate = 4,
  CriticalResist = 5,
  DefenseMagic = 6,
  DefensePhysic = 7,
  // Healing = 8,
  Hp = 9,
}

export enum PurpleBoardType {
  AttackMagic = 0,
  AttackPhysic = 1,
  CriticalMult = 2,
  CriticalMultResist = 3,
  CriticalRate = 4,
  CriticalResist = 5,
  DefenseMagic = 6,
  DefensePhysic = 7,
  // Healing = 8,
  Hp = 9,
}

export enum StatType {
  AttackMagic = 0,
  AttackPhysic = 1,
  CriticalMult = 2,
  CriticalMultResist = 3,
  CriticalRate = 4,
  CriticalResist = 5,
  DefenseMagic = 6,
  DefensePhysic = 7,
  Hp = 8,
  AttackSpeed = 9,
}

export enum Personality {
  Cool = 0,
  Gloomy = 1,
  Jolly = 2,
  Mad = 3,
  Naive = 4,
}

export enum Attack {
  Magic = 0,
  Physic = 1,
}

export enum Position {
  Front = 0,
  Middle = 1,
  Back = 2,
  Free = 3,
}

export enum Class {
  Class_0001 = 1,
  Class_0002 = 2,
  Class_0003 = 3,
}

export enum Race {
  Dragon = 0,
  Elf = 1,
  Fairy = 2,
  Furry = 3,
  Ghost = 4,
  Spirit = 5,
  Witch = 6,
}

export enum LabEffectCategory {
  Donation = 0,
  Production = 1,
  Schedule = 2,
  Restaurant = 3,
  Battle = 4,
  SoloRaidArtifactCountUp = 5,
  SoloEndDefaultCoinUp = 6,
  ArtifactManageSlotUp = 7,
  SpellManageSlotUp = 8,
  BattleGemValueUp = 9,
  FarmValueUp = 10,
}

export enum Aside3EffectCategory {
  None = 0,
  FrontSpUp = 1,
  MiddleSpUp = 2,
  BackSpUp = 3,
  FrontDamageUp = 4,
  MiddleDamageUp = 5,
  BackDamageUp = 6,
  AllDamageUp = 7,
  AllSkillDamageUp = 8,
  FrontReceiveDamageDown = 9,
  MiddleReceiveDamageDown = 10,
  BackReceiveDamageDown = 11,
  AllReceiveDamageDown = 12,
  AllReceivePhysicDamageDown = 13,
  AllReceiveMagicDamageDown = 14,
  AllCritUp = 15,
  AllCritMultUp = 16,
  AllCritResistUp = 17,
  AllCritMultResistUp = 18,
  AllHpUp = 19,
  AllAttackSpeedUp = 20,
}

export enum SortOrFilter {
  Sort = 0,
  Filter = 1,
}

export enum SortBy {
  Name = 0,
  Personality = 1,
  StarGrade = 2,
}

export enum SortType {
  Asc = 0,
  Desc = 1,
}

export enum FilterBy {
  Personality = 0,
  StarGrade = 1,
}

export enum SyncStatus {
  NotLinked = 0,
  Idle = 1,
  Downloading = 2,
  Uploading = 3,
  Errored = 4,
  Success = 5,
}
