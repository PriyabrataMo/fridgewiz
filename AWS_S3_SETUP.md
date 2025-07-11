# AWS S3 Setup Guide for FridgeWiz

This guide walks you through setting up Amazon S3 for image storage in the FridgeWiz application.

## Prerequisites

- AWS Account
- AWS CLI installed (optional but recommended)
- Basic understanding of AWS IAM

## Step 1: Create S3 Bucket

1. **Login to AWS Console** and navigate to S3 service
2. **Create a new bucket**:
   - Bucket name: `fridgewiz-images-[your-unique-suffix]`
   - Region: Choose your preferred region (e.g., `us-east-1`)
   - Keep versioning disabled for cost efficiency

3. **Configure bucket settings**:
   - Block all public access: **UNCHECK** (we need public read access for images)
   - Acknowledge the warning about public access

## Step 2: Set Bucket Policy

1. Go to your bucket → **Permissions** tab
2. **Bucket Policy** → Edit
3. Add the following policy (replace `YOUR_BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

## Step 3: Configure CORS

1. **Permissions** tab → **Cross-origin resource sharing (CORS)**
2. Add the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

## Step 4: Create IAM User

1. Navigate to **IAM** service in AWS Console
2. **Users** → **Create user**
3. Username: `fridgewiz-s3-user`
4. **Attach policies directly** → Create policy

### IAM Policy for S3 Access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
    }
  ]
}
```

5. **Create policy** with name: `FridgeWizS3Policy`
6. **Attach policy** to the user
7. **Create access key** for programmatic access

## Step 5: Environment Configuration

Add the following to your `.env` file:

```bash
# AWS S3 Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="fridgewiz-images-your-suffix"
```

## Step 6: Optional - CloudFront Setup

For better performance and global CDN:

1. **CloudFront** service → **Create distribution**
2. **Origin domain**: Select your S3 bucket
3. **Origin access**: Public
4. **Default cache behavior**: Allow all HTTP methods
5. **Create distribution**

Add to `.env`:

```bash
CLOUDFRONT_DOMAIN="https://d1234567890.cloudfront.net"
```

## Step 7: Testing

Test your setup by running the application:

```bash
# Start your development server
pnpm dev

# Test image upload via API
curl -X POST http://localhost:3000/api/chat \
  -F "conversationId=test-123" \
  -F "message=Test image upload" \
  -F "images=@path/to/test-image.jpg"
```

## Security Best Practices

1. **Rotate access keys** regularly
2. **Use least privilege principle** for IAM policies
3. **Enable CloudTrail** for audit logging
4. **Consider using S3 Bucket Notifications** for monitoring uploads
5. **Set up lifecycle policies** to manage storage costs

## Cost Optimization

1. **Set up lifecycle rules** to move old images to cheaper storage classes
2. **Enable S3 Intelligent Tiering** for automatic cost optimization
3. **Monitor usage** with AWS Cost Explorer
4. **Delete unused images** regularly

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check bucket policy and IAM permissions
2. **CORS errors**: Verify CORS configuration
3. **Access denied**: Ensure IAM user has correct permissions
4. **Images not loading**: Check public access settings

### Debugging Commands:

```bash
# Test AWS credentials
aws sts get-caller-identity

# List bucket contents
aws s3 ls s3://your-bucket-name

# Upload test file
aws s3 cp test.jpg s3://your-bucket-name/test.jpg
```

## Production Considerations

1. **Enable versioning** for important buckets
2. **Set up backup and replication** for disaster recovery
3. **Use AWS WAF** to protect CloudFront distribution
4. **Implement proper monitoring** with CloudWatch
5. **Set up alerts** for unusual activity

## File Structure in S3

The application organizes files as:

```
s3://your-bucket/
├── recipe-images/
│   ├── 1704067200000-abc123.jpg
│   ├── 1704067201000-def456.png
│   └── ...
└── (other folders as needed)
```

## Environment Variables Reference

| Variable                | Description                 | Required | Example                       |
| ----------------------- | --------------------------- | -------- | ----------------------------- |
| `AWS_REGION`            | AWS region for S3 bucket    | Yes      | `us-east-1`                   |
| `AWS_ACCESS_KEY_ID`     | IAM user access key         | Yes      | `AKIA...`                     |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key         | Yes      | `secret-key`                  |
| `S3_BUCKET_NAME`        | S3 bucket name              | Yes      | `fridgewiz-images`            |
| `CLOUDFRONT_DOMAIN`     | CloudFront distribution URL | No       | `https://d123.cloudfront.net` |
