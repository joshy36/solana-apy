export interface PoolPair {
  x_mint: string;
  x_reserve_amount: string;
  y_reserve: string;
  curve_Amp: string;
  pair_index: number;
}

export interface PoolData {
  pairs: PoolPair[];
  weights: {
    data: number[];
  };
  fee_num: {
    data: number;
  };
  fee_denom: {
    data: number;
  };
}
