# AWS Video Streaming Guide for No Buffering

To stream your large 3.8GB - 5GB video files without buffering, you should use **AWS S3 + CloudFront**. This setup delivers content globally with high speed.

## Step 1: Create an S3 Bucket
1. Go to the [AWS S3 Console](https://s3.console.aws.amazon.com/).
2. Click **Create bucket**.
3. Name it something unique (e.g., `edu-tutors-videos`).
4. Select your region (e.g., *ap-south-1* for Mumbai or *me-central-1* for UAE).
5. **Uncheck** "Block all public access" (we will secure it, but for simplicity, uncheck for now or configure a policy later).
6. Click **Create bucket**.

## Step 2: Upload Your Video
1. Open your new bucket.
2. Click **Upload**.
3. Drag and drop your `.mp4` file.
4. Click **Upload**.
   *Note: For 5GB files, this might take time depending on your internet speed.*

## Step 3: Enable HLS Streaming (Optional but Recommended for No Buffering)
*If you upload a 5GB MP4 directly, users might still buffer. The pro way is to convert it to HLS.*
1. Go to **AWS MediaConvert**.
2. Create a job to convert your MP4 file from S3 to **Apple HLS** format.
3. This breaks the video into small chunks (`.ts` files) and creates a manifest (`.m3u8`).
4. **Use the `.m3u8` link** in your app instead of the `.mp4` link.

## Step 4: Set up CloudFront (The CDN)
1. Go to the [CloudFront Console](https://console.aws.amazon.com/cloudfront/).
2. Click **Create Distribution**.
3. In **Origin Domain**, select your S3 bucket.
4. strict access policies if needed (OAI), or leave public if you unchecked blocking in S3.
5. Click **Create Distribution**.
6. Wait for it to deploy (enabled).
7. Copy the **Distribution Domain Name** (e.g., `d12345abcdef.cloudfront.net`).

## Step 5: Construct Your Final URL
Your video URL will look like this:
- **MP4 Direct Link** (Simpler): `https://d12345abcdef.cloudfront.net/your-video-name.mp4`
- **HLS Link** (Recommended): `https://d12345abcdef.cloudfront.net/hls/your-video.m3u8`

## Step 6: Update the Code
Once you have this URL, update the `videoUrl` in your `page.tsx` file (I have added a placeholder for you).
