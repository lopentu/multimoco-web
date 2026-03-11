#!/usr/bin/env bash
source /home/richard/miniconda3/etc/profile.d/conda.sh
conda activate redhen

cd /home/richard/redhen/multimoco-web
npm run build
npm run start