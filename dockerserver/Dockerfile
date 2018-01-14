FROM bvlc/caffe:cpu

RUN apt-get update -y && apt-get install git python python-pip -y
RUN pip install tornado

EXPOSE 9999

CMD ["python", "nudity_checker.py"]
