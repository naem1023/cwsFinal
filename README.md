# cwsFinal
Cloud Web Service 2020-2 Final project

# 목적
딥러닝을 통해 관세청 수출입 품목들에 대한 여러 수출 지표들을 사용하여 앞으로 유망한 사업 분야를 파악

요금 문제로 인해 AWS 인스턴스는 내려간 상태.

# Overview
## AWS
- EC2
  - Node.js
- Lambda
  - Get result of Deeplearning
- API Gateway
  - Setting for Lambda
- S3
  - Save result of Deeplearning
  
## Tensorflow
- Train 관세청 data
- Predict field which is good prospects.
- Save prediction
